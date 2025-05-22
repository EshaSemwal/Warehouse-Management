import React, { useState } from 'react';
import { FaSearch, FaQrcode } from 'react-icons/fa';
import './retrivel.css';
import { message } from 'antd';

const Retrieval = () => {
  // Form state
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    scanMode: false
  });

  const [isRetrieving, setIsRetrieving] = useState(false);

  const handleScanToggle = () => {
    setFormData({ ...formData, scanMode: !formData.scanMode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRetrieving(true);
    try {
      // Fetch inventory to find item by ID or name
      const invRes = await fetch('http://localhost:8000/api/inventory/');
      const invData = await invRes.json();
      const found = invData.find(i =>
        i.ProductID.toLowerCase() === formData.itemId.toLowerCase() ||
        i.ProductName.toLowerCase() === formData.itemId.toLowerCase()
      );
      if (!found) {
        message.error('Item not available.');
        setIsRetrieving(false);
        return;
      }
      const reqQty = Number(formData.quantity);
      if (reqQty > found.Quantity) {
        message.error(`Retrieval quantity exceeds available quantity. Maximum retrievable: ${found.Quantity}`);
        setIsRetrieving(false);
        return;
      }
      // Update item: reduce quantity, increase demand
      const updated = {
        Quantity: found.Quantity - reqQty,
        DemandPastMonth: (found.DemandPastMonth || 0) + reqQty
      };
      const patchRes = await fetch(`http://localhost:8000/api/inventory/${found.ProductID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (patchRes.ok) {
        message.success('Item retrieved and demand updated!');
        setFormData({ itemId: '', quantity: 1, scanMode: false });
      } else {
        message.error('Failed to retrieve item.');
      }
    } catch (err) {
      message.error('Error retrieving item.');
    }
    setIsRetrieving(false);
  };

  return (
    <div className="retrieval-container">
      <header className="retrieval-header">
        <h1>Item Retrieval</h1>
        <p>Retrieve products by name or ID</p>
      </header>
      <div className="retrieval-content">
        <section className="retrieval-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FaSearch /> Item ID/Name
                <button 
                  type="button" 
                  className="scan-toggle"
                  onClick={handleScanToggle}
                >
                  <FaQrcode /> {formData.scanMode ? 'Manual Entry' : 'Scan QR'}
                </button>
              </label>
              {formData.scanMode ? (
                <div className="qr-scan-placeholder">
                  <div className="qr-scanner">
                    <FaQrcode size={64} />
                    <p>Point camera at QR code</p>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={formData.itemId}
                  onChange={(e) => setFormData({...formData, itemId: e.target.value})}
                  placeholder="Enter item ID or name"
                  required
                />
              )}
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isRetrieving}
            >
              {isRetrieving ? 'Retrieving...' : 'Retrieve'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Retrieval;
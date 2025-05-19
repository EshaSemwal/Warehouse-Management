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
      // Try by ProductID first
      let response = await fetch(`http://localhost:8000/api/inventory/retrieve/${formData.itemId}?quantity=${formData.quantity}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        message.success('Item retrieved and demand updated!');
      } else {
        // If not found by ID, try by name
        const invRes = await fetch('http://localhost:8000/api/inventory/');
        const invData = await invRes.json();
        const found = invData.find(i => i.ProductName.toLowerCase() === formData.itemId.toLowerCase());
        if (!found) {
          message.error('Product not found.');
        } else if (found.Quantity < Number(formData.quantity)) {
          message.error(`Requested quantity exceeds available stock. Maximum available: ${found.Quantity}`);
        } else {
          // Try retrieval by found ProductID
          response = await fetch(`http://localhost:8000/api/inventory/retrieve/${found.ProductID}?quantity=${formData.quantity}`, {
            method: 'PATCH',
          });
          if (response.ok) {
            message.success('Item retrieved and demand updated!');
          } else {
            message.error('Failed to retrieve item.');
          }
        }
      }
    } catch (err) {
      message.error('Error retrieving item.');
    } finally {
      setIsRetrieving(false);
      setFormData({ itemId: '', quantity: 1, scanMode: false });
    }
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
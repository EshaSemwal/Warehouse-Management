import React, { useState, useEffect } from 'react';
import { 
  FaBoxOpen, 
  FaRuler, 
  FaWeightHanging, 
  FaBoxes,
  FaSortAmountDownAlt,
  FaCamera,
  FaWarehouse,
  FaCheckCircle,
  FaChartPie,
  FaPlus,
  FaPercentage,
  FaBalanceScale
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { message, Progress, Tooltip } from 'antd';
import './storage.css';

const StorageOptimization = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    category: '',
    newCategory: '',
    quantity: 1,
    price: ''
  });
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Storage simulation
  const [bins, setBins] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState({
    totalRacks: 0,
    racksUsed: 0,
    totalWeightCapacity: 0,
    totalUsedWeight: 0,
    percentRacksUsed: 0,
    percentSpaceUsed: 0
  });

  const [suggestedBins, setSuggestedBins] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchBinsAndStats = async () => {
    try {
      const binsRes = await fetch('http://localhost:8000/api/inventory/rack-capacity');
      const binsData = await binsRes.json();
      setBins(binsData);
      
      if (binsData.length === 0) {
        setWarehouseStats({
          totalRacks: 0,
          racksUsed: 0,
          totalWeightCapacity: 0,
          totalUsedWeight: 0,
          percentRacksUsed: 0,
          percentSpaceUsed: 0
        });
        return;
      }
      
      const totalRacks = binsData.length;
      const racksUsed = binsData.filter(r => r.used_weight > 0).length;
      const totalWeightCapacity = totalRacks * 100;
      const totalUsedWeight = binsData.reduce((sum, r) => sum + r.used_weight, 0);
      const percentSpaceUsed = totalWeightCapacity > 0 ? Math.round((totalUsedWeight / totalWeightCapacity) * 100) : 0;
      const percentRacksUsed = totalRacks > 0 ? Math.round((racksUsed / totalRacks) * 100) : 0;
      
      setWarehouseStats({
        totalRacks,
        racksUsed,
        totalWeightCapacity,
        totalUsedWeight,
        percentRacksUsed,
        percentSpaceUsed
      });
    } catch (error) {
      message.error('Failed to fetch rack data');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/inventory/');
        const data = await res.json();
        const uniqueCategories = Array.from(new Set(data.map(item => item.Category)));
        setCategories(uniqueCategories);
        await fetchBinsAndStats();
      } catch (error) {
        message.error('Failed to fetch inventory data');
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setShowNewCategory(value === 'Other');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    const category = showNewCategory ? formData.newCategory : formData.category;
    const itemData = {
      ProductID: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ProductName: formData.name,
      Category: category,
      Quantity: Number(formData.quantity),
      DemandPastMonth: 0,
      Price: Number(formData.price),
      IndividualWeight_kg: Number(formData.weight),
      TotalWeight_kg: Number(formData.weight) * Number(formData.quantity)
    };

    try {
      const res = await fetch('http://localhost:8000/api/inventory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (!res.ok) {
        if (res.status === 422 || res.status === 400) {
          const invRes = await fetch('http://localhost:8000/api/inventory/');
          const invData = await invRes.json();
          const existing = invData.find(i => i.ProductName === formData.name);
          
          if (existing) {
            const patchRes = await fetch(`http://localhost:8000/api/inventory/${existing.ProductID}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Quantity: existing.Quantity + Number(formData.quantity) })
            });
            if (!patchRes.ok) throw new Error('Failed to update item');
          } else {
            throw new Error('Failed to add or update item');
          }
        } else {
          throw new Error('Failed to add item');
        }
      }

      // Refresh categories
      const catRes = await fetch('http://localhost:8000/api/inventory/');
      const catData = await catRes.json();
      const uniqueCategories = Array.from(new Set(catData.map(item => item.Category)));
      setCategories(uniqueCategories);
      
      await fetchBinsAndStats();
      setFormData({ name: '', weight: '', category: '', newCategory: '', quantity: 1, price: '' });
      setShowNewCategory(false);
      message.success('Item added successfully');
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const onDragStart = (start) => {
    setDraggingItem(start.draggableId);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const newBins = [...bins];
    const [reorderedItem] = newBins.splice(result.source.index, 1);
    newBins.splice(result.destination.index, 0, reorderedItem);
    
    setBins(newBins);
    setDraggingItem(null);
  };

  const getBinColor = (percentUsed) => {
    if (percentUsed >= 90) return '#f56565'; // Red for full
    if (percentUsed >= 70) return '#ed8936'; // Orange for nearly full
    return '#48bb78'; // Green for available
  };

  return (
    <div className="storage-optimization">
      <header className="storage-header">
        <h1><FaWarehouse /> Storage Optimization</h1>
        <p className="subtitle">Maximize warehouse efficiency with intelligent item placement</p>
      </header>

      <div className="storage-content">
        {/* Left Column - Form */}
        <section className="add-item-section">
          <div className="section-header">
            <h2><FaBoxOpen /> Add New Inventory Item</h2>
            <p>Enter item details to optimize storage placement</p>
          </div>
          
          <form onSubmit={handleSubmit} className="item-form">
            <div className="form-group">
              <label htmlFor="item-name">Item Name</label>
              <input
                id="item-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-weight"><FaWeightHanging /> Weight (kg)</label>
                <input
                  id="item-weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="item-quantity">Quantity</label>
                <input
                  id="item-quantity"
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="item-category"><FaBoxes /> Category</label>
              <select
                id="item-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Other">Other category...</option>
              </select>
              
              {showNewCategory && (
                <input
                  type="text"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleChange}
                  placeholder="Enter new category name"
                  required
                  className="new-category-input"
                />
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="item-price">Price (₹)</label>
              <input
                id="item-price"
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isAdding}>
              {isAdding ? (
                <span>Adding Item...</span>
              ) : (
                <>
                  <FaPlus /> Add Inventory Item
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Column - Visualization */}
        <section className="optimization-section">
          {/* Warehouse Statistics */}
          <div className="stats-card">
            <div className="stats-header">
              <h3><FaChartPie /> Warehouse Capacity</h3>
              <Tooltip title="Based on current inventory and rack configuration">
                <span className="info-badge">i</span>
              </Tooltip>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon"><FaPercentage /></div>
                <div className="stat-value">{warehouseStats.percentSpaceUsed || 0}%</div>
                <div className="stat-label">Space Utilized</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon"><FaWarehouse /></div>
                <div className="stat-value">
                  {warehouseStats.racksUsed}/{warehouseStats.totalRacks}
                </div>
                <div className="stat-label">Racks Used</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon"><FaBalanceScale /></div>
                <div className="stat-value">
                  {(warehouseStats.totalUsedWeight/1000).toFixed(2)}T
                </div>
                <div className="stat-label">Weight Stored</div>
              </div>
            </div>
            
            <div className="capacity-bar">
              <Progress 
                percent={warehouseStats.percentSpaceUsed} 
                strokeColor={getBinColor(warehouseStats.percentSpaceUsed)}
                showInfo={false}
              />
              <div className="capacity-labels">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Storage Recommendations */}
          {suggestedBins.length > 0 && (
            <div className="recommendation-card">
              <div className="recommendation-header">
                <h3><FaCheckCircle /> Recommended Locations</h3>
                <span className="badge">{suggestedBins.length} suggestions</span>
              </div>
              
              <div className="recommendation-list">
                {suggestedBins.map((bin, index) => (
                  <div key={bin.id} className={`recommendation-item ${index === 0 ? 'best-match' : ''}`}>
                    <div className="location-id">{bin.zone}{bin.shelf}-{bin.rack}</div>
                    <div className="location-stats">
                      <div className="stat">
                        <span>Space:</span>
                        <Progress 
                          percent={100 - (bin.capacity - bin.used)} 
                          strokeColor={getBinColor(100 - (bin.capacity - bin.used))}
                          showInfo={false}
                        />
                        <span>{bin.capacity - bin.used}% available</span>
                      </div>
                      <div className="stat">
                        <span>Weight:</span>
                        <span>{bin.weightLimit - bin.currentWeight}kg available</span>
                      </div>
                    </div>
                    {index === 0 && <div className="best-tag">Best Match</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rack Visualization */}
          <div className="rack-visualization">
            <div className="section-header">
              <h3><FaWarehouse /> Rack Availability</h3>
              <p>Visual representation of current storage utilization</p>
            </div>
            
            {bins.length === 0 ? (
              <div className="empty-state">
                <p>No rack data available. Please add inventory items.</p>
              </div>
            ) : (
              <div className="rack-grid">
                {bins.slice(0, 6).map((bin) => {
                  const percentUsed = Math.round((bin.used_weight / 100) * 100);
                  return (
                    <div key={bin.id} className="rack-card">
                      <div className="rack-header">
                        <span className="rack-id">{bin.zone}{bin.shelf}-{bin.rack}</span>
                        <span className="rack-percent" style={{ color: getBinColor(percentUsed) }}>
                          {percentUsed}% used
                        </span>
                      </div>
                      <div className="rack-visual">
                        <div 
                          className="rack-used-space" 
                          style={{
                            height: `${percentUsed}%`,
                            backgroundColor: getBinColor(percentUsed)
                          }}
                        />
                      </div>
                      <div className="rack-weight">
                        {bin.used_weight.toFixed(1)} / 100 kg
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StorageOptimization;
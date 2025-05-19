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
  FaChartPie
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './storage.css';

const AddItems = () => {
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
    percentRacksUsed: 0
  });

  const [suggestedBins, setSuggestedBins] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/inventory/')
      .then(res => res.json())
      .then(data => {
        const uniqueCategories = Array.from(new Set(data.map(item => item.Category)));
        setCategories(uniqueCategories);
      });
    // Fetch rack capacity for bins and warehouse stats
    fetch('http://localhost:8000/api/inventory/rack-capacity')
      .then(res => res.json())
      .then(data => {
        setBins(data);
        // Calculate all zones present
        const zones = Array.from(new Set(data.map(r => r.zone)));
        const racksPerZone = 10 * 20; // 10 shelves x 20 racks
        const totalRacks = zones.length * racksPerZone;
        // Build a set of used racks (zone-shelf-rack)
        const usedRackSet = new Set(data.filter(r => r.used_weight > 0).map(r => `${r.zone}-${r.shelf}-${r.rack}`));
        const racksUsed = usedRackSet.size;
        const totalWeightCapacity = totalRacks * 100;
        const totalUsedWeight = data.reduce((sum, r) => sum + r.used_weight, 0);
        const percentRacksUsed = totalRacks > 0 ? Math.round((racksUsed / totalRacks) * 100) : 0;
        setWarehouseStats({
          totalRacks,
          racksUsed,
          totalWeightCapacity,
          totalUsedWeight,
          percentRacksUsed
        });
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setShowNewCategory(value === 'Other');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = showNewCategory ? formData.newCategory : formData.category;
    // Compose item data for backend
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
      // Try to create new item
      const res = await fetch('http://localhost:8000/api/inventory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (!res.ok) {
        // If already exists, try to PATCH (update quantity)
        if (res.status === 422 || res.status === 400) {
          // Find the product by name in categories (fetch inventory)
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
      // Reset form
      setFormData({ name: '', weight: '', category: '', newCategory: '', quantity: 1, price: '' });
      setShowNewCategory(false);
      alert('Item added or updated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Drag and drop handlers
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

  return (
    <div className="add-items-container">
      <header className="page-header">
        <h1><FaBoxOpen /> Storage Optimization</h1>
        <p>Add new items and optimize warehouse placement</p>
      </header>

      <div className="content-grid">
        {/* Add Item Form */}
        <section className="form-section">
          <h2><FaBoxOpen /> Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label><FaWeightHanging /> Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label><FaBoxes /> Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {showNewCategory && (
                <input
                  type="text"
                  name="newCategory"
                  placeholder="Enter new category"
                  value={formData.newCategory}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Add Item
            </button>
          </form>
        </section>

        {/* Storage Optimization Section */}
        <section className="optimization-section">
          {/* Algorithm Suggestions */}
          {suggestedBins.length > 0 && (
            <div className="suggestions-box">
              <h3><FaCheckCircle /> Recommended Storage Locations</h3>
              {suggestedBins.map((bin, index) => (
                <div key={bin.id} className={`suggestion ${index === 0 ? 'best' : ''}`}>
                  <h4>{bin.name}</h4>
                  <div className="suggestion-stats">
                    <div>
                      <span>Space Available:</span>
                      <progress value={bin.capacity - bin.used} max={bin.capacity}></progress>
                      <span>{bin.capacity - bin.used}%</span>
                    </div>
                    <div>
                      <span>Weight Available:</span>
                      <span>{bin.weightLimit - bin.currentWeight}kg</span>
                    </div>
                  </div>
                  {index === 0 && <div className="best-badge">Best Match</div>}
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Storage Bins */}
          <div className="bin-visualization">
            <h3><FaWarehouse /> Storage Racks</h3>
            <p>Each rack shows % emptiness and its capacity</p>
            <div className="bins-container">
              {bins.filter(bin => bin.used_weight < 99.99).map((bin) => {
                const percentEmpty = 100 - Math.round((bin.used_weight / 100) * 100);
                return (
                  <div key={bin.id} className="bin-card">
                    <div className="bin-header">
                      <h4>{bin.zone}{bin.shelf}-{bin.rack}</h4>
                      <div className="bin-status">
                        <span className={`capacity ${percentEmpty < 30 ? 'warning' : ''}`}>
                          {percentEmpty}% empty
                        </span>
                        <span className="weight">
                          {bin.used_weight.toFixed(1)}/100kg
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warehouse Stats */}
          <div className="warehouse-stats">
            <h3><FaChartPie /> Warehouse Capacity</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{warehouseStats.percentRacksUsed}%</div>
                <div className="stat-label">Total Space Used</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{warehouseStats.racksUsed}/{warehouseStats.totalRacks}</div>
                <div className="stat-label">Racks Used</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{(warehouseStats.totalUsedWeight/1000).toFixed(2)}T/{(warehouseStats.totalWeightCapacity/1000).toFixed(2)}T</div>
                <div className="stat-label">Weight Capacity Used</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddItems;
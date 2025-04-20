import React, { useState } from 'react';
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
    dimensions: { length: '', width: '', height: '' },
    weight: '',
    category: 'Electronics',
    quantity: 1,
    frequency: 'Medium',
    image: null
  });

  // Storage simulation
  const [bins, setBins] = useState([
    { id: 'bin-1', name: 'Rack A-12', capacity: 80, used: 45, weightLimit: 200, currentWeight: 120 },
    { id: 'bin-2', name: 'Rack B-05', capacity: 80, used: 30, weightLimit: 150, currentWeight: 90 },
    { id: 'bin-3', name: 'Rack C-22', capacity: 80, used: 60, weightLimit: 250, currentWeight: 180 },
    { id: 'bin-4', name: 'Rack D-01', capacity: 80, used: 20, weightLimit: 100, currentWeight: 40 }
  ]);

  const [suggestedBins, setSuggestedBins] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [name]: value }
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate storage suggestions
  const calculateSuggestions = () => {
    // Mock optimization algorithm
    const suggestions = bins
      .map(bin => {
        const availableCapacity = bin.capacity - bin.used;
        const availableWeight = bin.weightLimit - bin.currentWeight;
        const score = availableCapacity * 0.7 + availableWeight * 0.3;
        return { ...bin, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    setSuggestedBins(suggestions);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateSuggestions();
    // In a real app, you would send data to backend here
    console.log('Form submitted:', formData);
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
              <label><FaRuler /> Dimensions (cm)</label>
              <div className="dimensions-input">
                <input
                  type="number"
                  name="length"
                  placeholder="Length"
                  value={formData.dimensions.length}
                  onChange={handleDimensionChange}
                  required
                />
                <input
                  type="number"
                  name="width"
                  placeholder="Width"
                  value={formData.dimensions.width}
                  onChange={handleDimensionChange}
                  required
                />
                <input
                  type="number"
                  name="height"
                  placeholder="Height"
                  value={formData.dimensions.height}
                  onChange={handleDimensionChange}
                  required
                />
              </div>
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
              >
                <option value="Electronics">Electronics</option>
                <option value="Tools">Tools</option>
                <option value="Packages">Packages</option>
                <option value="Machinery">Machinery</option>
              </select>
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
              <label><FaSortAmountDownAlt /> Retrieval Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="High">High (Frequent access)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low (Rarely accessed)</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaCamera /> Item Image</label>
              <div className="image-upload">
                <input
                  type="file"
                  id="item-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="item-image" className="upload-btn">
                  Choose File
                </label>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="image-preview" />
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Calculate Optimal Storage
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

          {/* Bin Visualization */}
          <div className="bin-visualization">
            <h3><FaWarehouse /> Storage Bins</h3>
            <p>Drag to rearrange by priority</p>
            
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="bins">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="bins-container"
                  >
                    {bins.map((bin, index) => (
                      <Draggable key={bin.id} draggableId={bin.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bin-card ${draggingItem === bin.id ? 'dragging' : ''}`}
                          >
                            <div className="bin-header">
                              <h4>{bin.name}</h4>
                              <div className="bin-status">
                                <span className={`capacity ${bin.used > 70 ? 'warning' : ''}`}>
                                  {bin.used}% full
                                </span>
                                <span className="weight">
                                  {bin.currentWeight}/{bin.weightLimit}kg
                                </span>
                              </div>
                            </div>
                            <div className="bin-visual">
                              <div 
                                className="bin-used-space" 
                                style={{ height: `${bin.used}%` }}
                              ></div>
                            </div>
                            <div className="bin-footer">
                              <div className="bin-dimensions">
                                <span>120cm × 80cm × 200cm</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Warehouse Stats */}
          <div className="warehouse-stats">
            <h3><FaChartPie /> Warehouse Capacity</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">65%</div>
                <div className="stat-label">Total Space Used</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">32/50</div>
                <div className="stat-label">Shelves Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">1.2T/5T</div>
                <div className="stat-label">Weight Capacity</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddItems;
import React, { useState } from 'react';
import { FaSearch, FaQrcode, FaRobot, FaRoute, FaClock, FaCheckCircle } from 'react-icons/fa';
import './retrivel.css';

const Retrieval = () => {
  // Form state
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    scanMode: false
  });

  // Retrieval state
  const [path, setPath] = useState(null);
  const [eta, setEta] = useState(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  // Sample warehouse layout (15x15 grid)
  const warehouseLayout = Array(15).fill().map(() => Array(15).fill(0));
  // Mark some obstacles
  warehouseLayout[3][5] = 1;
  warehouseLayout[7][2] = 1;
  warehouseLayout[10][12] = 1;

  // Mock pathfinding algorithm
  const findPath = (start, end) => {
    const path = [];
    let current = [...start];
    
    while (current[0] !== end[0] || current[1] !== end[1]) {
      if (current[0] < end[0]) current[0]++;
      else if (current[0] > end[0]) current[0]--;
      
      if (current[1] < end[1]) current[1]++;
      else if (current[1] > end[1]) current[1]--;
      
      path.push([...current]);
    }
    
    return path;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRetrieving(true);
    
    setTimeout(() => {
      const calculatedPath = findPath([0, 0], [14, 14]);
      setPath(calculatedPath);
      setEta(Math.floor(Math.random() * 5) + 1);
      setIsRetrieving(false);
    }, 1500);
  };

  const handleScanToggle = () => {
    setFormData({ ...formData, scanMode: !formData.scanMode });
  };

  return (
    <div className="retrieval-container">
      <header className="retrieval-header">
        <h1><FaRoute /> Item Retrieval</h1>
        <p>Optimized pathfinding for fastest item retrieval</p>
      </header>

      <div className="retrieval-content">
        {/* Retrieval Form */}
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
              {isRetrieving ? 'Calculating...' : 'Find Optimal Path'}
            </button>
          </form>
        </section>

        {/* Visualization Section */}
        <section className="visualization-section">
          {path ? (
            <>
              <div className="path-visualization">
                <h3><FaRoute /> Retrieval Path</h3>
                <div className="warehouse-grid">
                  {warehouseLayout.map((row, i) => (
                    <div key={i} className="grid-row">
                      {row.map((cell, j) => {
                        const isPath = path.some(([x, y]) => x === i && y === j);
                        const isStart = i === 0 && j === 0;
                        const isEnd = i === 14 && j === 14;
                        return (
                          <div 
                            key={j}
                            className={`grid-cell 
                              ${cell ? 'obstacle' : ''} 
                              ${isPath ? 'path' : ''}
                              ${isStart ? 'start' : ''}
                              ${isEnd ? 'end' : ''}
                            `}
                          >
                            {isStart && 'S'}
                            {isEnd && 'E'}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="retrieval-confirmation">
                <h3><FaClock /> Estimated Retrieval Time: {eta} minutes</h3>
                
                {/* Replaced Lottie animation with animated icon */}
                <div className="robot-animation">
                  <FaRobot size={64} className="pulse-animation" />
                  <p>Autonomous retrieval robot dispatched</p>
                </div>

                <button className="confirm-btn">
                  <FaCheckCircle /> Confirm Retrieval
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <FaRobot size={64} />
              <p>Submit a retrieval request to visualize the optimal path</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Retrieval;
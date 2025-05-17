import React, { useState, useEffect } from 'react';
import { 
  FaBoxes, 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown,
  FaMicrochip,
  FaToolbox,
  FaBox,
  FaPallet,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaUtensils,
  FaTshirt,
  FaRunning,
  FaBook,
  FaCouch,
  FaHome,
  FaWineBottle
} from 'react-icons/fa';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './inventory.css';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters/sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'ProductName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from FastAPI backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory data');
        }
        const data = await response.json();
        setInventoryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, []);

  // Calculate status based on quantity and demand
  const calculateStatus = (quantity, demand) => {
    const ratio = quantity / (demand || 1); // Prevent division by zero
    if (ratio < 0.5) return 'Critical';
    if (ratio < 1) return 'Low Stock';
    return 'In Stock';
  };

  // Process inventory data with calculated status
  const processedInventory = inventoryData.map(item => ({
    ...item,
    status: calculateStatus(item.Quantity, item.DemandPastMonth),
    threshold: item.DemandPastMonth * 1.2 // 20% buffer over past month's demand
  }));

  // Get all unique categories from inventory
  const allCategories = ['All', ...new Set(inventoryData.map(item => item.Category))];

  // Filter and sort logic
  const filteredItems = processedInventory.filter(item => {
    return (
      (item.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.ProductID.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'All' || item.Category === categoryFilter) &&
      (statusFilter === 'All' || item.status === statusFilter)
    );
  }).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Electronics': return <FaMicrochip className="category-icon" />;
      case 'Tools': return <FaToolbox className="category-icon" />;
      case 'Groceries': return <FaUtensils className="category-icon" />;
      case 'Clothing': return <FaTshirt className="category-icon" />;
      case 'Fitness': return <FaRunning className="category-icon" />;
      case 'Books': return <FaBook className="category-icon" />;
      case 'Furniture': return <FaCouch className="category-icon" />;
      case 'Home Decor': return <FaHome className="category-icon" />;
      case 'Beverage': return <FaWineBottle className="category-icon" />;
      case 'Toys and Games': return <FaBox className="category-icon" />;
      case 'Beauty and Personal Care': return <FaPallet className="category-icon" />;
      default: return <FaBoxes className="category-icon" />;
    }
  };

  // Get stock level color
  const getStockLevel = (quantity, threshold) => {
    const percentage = (quantity / threshold) * 100;
    if (percentage < 50) return 'critical';
    if (percentage < 100) return 'low';
    return 'healthy';
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading-spinner">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error-message">
          <FaExclamationTriangle /> Error loading inventory: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <h1><FaBoxes /> Inventory Management</h1>
        <p>Real-time stock monitoring and control</p>
      </header>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label><FaFilter /> Category:</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><FaFilter /> Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('ProductName')}>
                <div className="header-cell">
                  Product Name
                  <FaSortAmountDown className={`sort-icon ${sortConfig.key === 'ProductName' ? 'active' : ''}`} />
                </div>
              </th>
              <th>ID</th>
              <th>Category</th>
              <th onClick={() => requestSort('Quantity')}>
                <div className="header-cell">
                  Quantity
                  <FaSortAmountDown className={`sort-icon ${sortConfig.key === 'Quantity' ? 'active' : ''}`} />
                </div>
              </th>
              <th>Demand (Past Month)</th>
              <th>Stock Level</th>
              <th>Location</th>
              <th onClick={() => requestSort('status')}>
                <div className="header-cell">
                  Status
                  <FaSortAmountDown className={`sort-icon ${sortConfig.key === 'status' ? 'active' : ''}`} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.ProductID} className={`status-${getStockLevel(item.Quantity, item.threshold)}`}>
                  <td>{item.ProductName}</td>
                  <td className="item-id">{item.ProductID}</td>
                  <td>
                    <div className="category-cell">
                      {getCategoryIcon(item.Category)}
                      {item.Category}
                    </div>
                  </td>
                  <td>{item.Quantity}</td>
                  <td>{item.DemandPastMonth}</td>
                  <td>
                    <div className="stock-meter">
                      <CircularProgressbar
                        value={(item.Quantity / item.threshold) * 100}
                        text={`${Math.round((item.Quantity / item.threshold) * 100)}%`}
                        styles={{
                          path: {
                            stroke: getStockLevel(item.Quantity, item.threshold) === 'critical' ? '#ef4444' : 
                                   getStockLevel(item.Quantity, item.threshold) === 'low' ? '#f59e0b' : '#10b981'
                          },
                          text: {
                            fill: '#1e293b',
                            fontSize: '24px',
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td>{item.ShelfLocation}</td>
                  <td>
                    <div className="status-cell">
                      {item.status === 'Critical' && <FaExclamationTriangle className="warning-icon" />}
                      {item.status}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No inventory items found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{processedInventory.length}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p>{processedInventory.filter(item => item.status === 'Low Stock').length}</p>
        </div>
        <div className="stat-card">
          <h3>Critical Items</h3>
          <p>{processedInventory.filter(item => item.status === 'Critical').length}</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
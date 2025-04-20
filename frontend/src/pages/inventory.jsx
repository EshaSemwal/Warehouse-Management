import React, { useState } from 'react';
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
  FaExclamationTriangle
} from 'react-icons/fa';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './inventory.css';

const Inventory = () => {
  // Sample inventory data
  const inventoryData = [
    { id: 'ITEM-1001', name: 'Circuit Board', category: 'Electronics', quantity: 124, location: 'Rack A-12', status: 'In Stock', threshold: 150 },
    { id: 'ITEM-1002', name: 'Power Drill', category: 'Tools', quantity: 32, location: 'Rack B-05', status: 'Low Stock', threshold: 40 },
    { id: 'ITEM-1003', name: 'Storage Box', category: 'Packages', quantity: 89, location: 'Rack C-22', status: 'In Stock', threshold: 100 },
    { id: 'ITEM-1004', name: 'Conveyor Belt', category: 'Machinery', quantity: 5, location: 'Rack D-01', status: 'Critical', threshold: 10 },
    { id: 'ITEM-1005', name: 'Resistor Pack', category: 'Electronics', quantity: 245, location: 'Rack A-08', status: 'In Stock', threshold: 200 },
    { id: 'ITEM-1006', name: 'Wrench Set', category: 'Tools', quantity: 18, location: 'Rack B-11', status: 'Low Stock', threshold: 25 },
    { id: 'ITEM-1007', name: 'Shipping Box', category: 'Packages', quantity: 120, location: 'Rack C-15', status: 'In Stock', threshold: 150 },
    { id: 'ITEM-1008', name: 'Forklift Part', category: 'Machinery', quantity: 2, location: 'Rack D-03', status: 'Critical', threshold: 5 }
  ];

  // State for filters/sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort logic
  const filteredItems = inventoryData.filter(item => {
    return (
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'All' || item.category === categoryFilter) &&
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
      case 'Packages': return <FaBox className="category-icon" />;
      case 'Machinery': return <FaPallet className="category-icon" />;
      default: return <FaBoxes className="category-icon" />;
    }
  };

  // Get stock level color
  const getStockLevel = (quantity, threshold) => {
    const percentage = (quantity / threshold) * 100;
    if (percentage < 20) return 'critical';
    if (percentage < 50) return 'low';
    return 'healthy';
  };

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
            placeholder="Search items..."
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
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Tools">Tools</option>
              <option value="Packages">Packages</option>
              <option value="Machinery">Machinery</option>
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
              <th onClick={() => requestSort('name')}>
                <div className="header-cell">
                  Item Name
                  <FaSortAmountDown className={`sort-icon ${sortConfig.key === 'name' ? 'active' : ''}`} />
                </div>
              </th>
              <th>ID</th>
              <th>Category</th>
              <th onClick={() => requestSort('quantity')}>
                <div className="header-cell">
                  Quantity
                  <FaSortAmountDown className={`sort-icon ${sortConfig.key === 'quantity' ? 'active' : ''}`} />
                </div>
              </th>
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
            {currentItems.map((item) => (
              <tr key={item.id} className={`status-${getStockLevel(item.quantity, item.threshold)}`}>
                <td>{item.name}</td>
                <td className="item-id">{item.id}</td>
                <td>
                  <div className="category-cell">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </div>
                </td>
                <td>{item.quantity}</td>
                <td>
                  <div className="stock-meter">
                    <CircularProgressbar
                      value={(item.quantity / item.threshold) * 100}
                      text={`${Math.round((item.quantity / item.threshold) * 100)}%`}
                      styles={{
                        path: {
                          stroke: getStockLevel(item.quantity, item.threshold) === 'critical' ? '#ef4444' : 
                                 getStockLevel(item.quantity, item.threshold) === 'low' ? '#f59e0b' : '#10b981'
                        },
                        text: {
                          fill: '#1e293b',
                          fontSize: '24px',
                        }
                      }}
                    />
                  </div>
                </td>
                <td>{item.location}</td>
                <td>
                  <div className="status-cell">
                    {item.status === 'Critical' && <FaExclamationTriangle className="warning-icon" />}
                    {item.status}
                  </div>
                </td>
              </tr>
            ))}
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
          <h3>Total Items</h3>
          <p>{inventoryData.length}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p>{inventoryData.filter(item => item.status === 'Low Stock').length}</p>
        </div>
        <div className="stat-card">
          <h3>Critical Items</h3>
          <p>{inventoryData.filter(item => item.status === 'Critical').length}</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
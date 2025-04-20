import React, { useState } from 'react';
import {
  FaUserCog,
  FaUsers,
  FaUserShield,
  FaUserPlus,
  FaUserEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaKey,
  FaUserCircle,
  FaWarehouse,
  FaBell,
  FaCloudUploadAlt
} from 'react-icons/fa';
import './settings.css';

const Settings = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('users');
  
  // User management
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@warehouse.com', role: 'admin', avatar: '' },
    { id: 2, name: 'Manager John', email: 'john@warehouse.com', role: 'staff', avatar: '' },
    { id: 3, name: 'Viewer Sarah', email: 'sarah@warehouse.com', role: 'viewer', avatar: '' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer', password: '' });
  const [editingUser, setEditingUser] = useState(null);

  // Access controls
  const [accessControls, setAccessControls] = useState({
    admin: {
      analytics: true,
      alerts: true,
      retrieval: true,
      settings: true
    },
    staff: {
      analytics: true,
      alerts: true,
      retrieval: true,
      settings: false
    },
    viewer: {
      analytics: true,
      alerts: false,
      retrieval: false,
      settings: false
    }
  });

  // System preferences
  const [preferences, setPreferences] = useState({
    notifications: true,
    backupFrequency: 'weekly',
    warehouseConfig: {
      length: 50,
      width: 30,
      height: 10,
      slotSize: 2
    }
  });

  // Password change
  const [passwordChange, setPasswordChange] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Profile picture
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');

  // Handle user actions
  const handleAddUser = () => {
    const user = { ...newUser, id: users.length + 1 };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'viewer', password: '' });
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Handle access control toggle
  const toggleAccess = (role, feature) => {
    setAccessControls({
      ...accessControls,
      [role]: {
        ...accessControls[role],
        [feature]: !accessControls[role][feature]
      }
    });
  };

  // Handle preference changes
  const handlePreferenceChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  // Handle warehouse config change
  const handleWarehouseConfigChange = (key, value) => {
    setPreferences({
      ...preferences,
      warehouseConfig: {
        ...preferences.warehouseConfig,
        [key]: Number(value)
      }
    });
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1><FaUserCog /> System Settings</h1>
        <p>Manage users, access controls, and system preferences</p>
      </header>

      <div className="settings-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> User Management
        </button>
        <button
          className={activeTab === 'access' ? 'active' : ''}
          onClick={() => setActiveTab('access')}
        >
          <FaUserShield /> Access Controls
        </button>
        <button
          className={activeTab === 'preferences' ? 'active' : ''}
          onClick={() => setActiveTab('preferences')}
        >
          <FaWarehouse /> System Preferences
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <FaUserCircle /> My Profile
        </button>
      </div>

      <div className="settings-content">
        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="users-management">
            <h2><FaUsers /> User Management</h2>
            
            {/* Add/Edit User Form */}
            <div className="user-form">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, name: e.target.value}) 
                    : setNewUser({...newUser, name: e.target.value})
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, email: e.target.value}) 
                    : setNewUser({...newUser, email: e.target.value})
                  }
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={(e) => editingUser 
                    ? setEditingUser({...editingUser, role: e.target.value}) 
                    : setNewUser({...newUser, role: e.target.value})
                  }
                >
                  <option value="admin">Administrator</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Set temporary password"
                  />
                </div>
              )}
              <div className="form-actions">
                {editingUser ? (
                  <>
                    <button className="cancel-btn" onClick={() => setEditingUser(null)}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleUpdateUser}>
                      <FaSave /> Save Changes
                    </button>
                  </>
                ) : (
                  <button className="add-btn" onClick={handleAddUser}>
                    <FaUserPlus /> Add User
                  </button>
                )}
              </div>
            </div>

            {/* Users List */}
            <div className="users-list">
              <h3>Current Users</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Administrator' : 
                           user.role === 'staff' ? 'Staff' : 'Viewer'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => setEditingUser({...user})}
                        >
                          <FaUserEdit />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Access Controls Tab */}
        {activeTab === 'access' && (
          <div className="access-controls">
            <h2><FaUserShield /> Role-Based Access Controls</h2>
            
            <div className="access-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Administrator</th>
                    <th>Staff</th>
                    <th>Viewer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Analytics Dashboard</td>
                    <td>
                      <button className="toggle-btn" disabled>
                        <FaToggleOn className="on" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('staff', 'analytics')}
                      >
                        {accessControls.staff.analytics ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('viewer', 'analytics')}
                      >
                        {accessControls.viewer.analytics ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Alerts Management</td>
                    <td>
                      <button className="toggle-btn" disabled>
                        <FaToggleOn className="on" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('staff', 'alerts')}
                      >
                        {accessControls.staff.alerts ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('viewer', 'alerts')}
                      >
                        {accessControls.viewer.alerts ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Item Retrieval</td>
                    <td>
                      <button className="toggle-btn" disabled>
                        <FaToggleOn className="on" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('staff', 'retrieval')}
                      >
                        {accessControls.staff.retrieval ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('viewer', 'retrieval')}
                      >
                        {accessControls.viewer.retrieval ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>System Settings</td>
                    <td>
                      <button className="toggle-btn" disabled>
                        <FaToggleOn className="on" />
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('staff', 'settings')}
                      >
                        {accessControls.staff.settings ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                    <td>
                      <button 
                        className="toggle-btn"
                        onClick={() => toggleAccess('viewer', 'settings')}
                      >
                        {accessControls.viewer.settings ? 
                          <FaToggleOn className="on" /> : 
                          <FaToggleOff className="off" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="system-preferences">
            <h2><FaWarehouse /> System Preferences</h2>
            
            <div className="preferences-section">
              <h3><FaBell /> Notifications</h3>
              <div className="preference-item">
                <label>Enable System Notifications</label>
                <button 
                  className="toggle-btn"
                  onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                >
                  {preferences.notifications ? 
                    <FaToggleOn className="on" /> : 
                    <FaToggleOff className="off" />}
                </button>
              </div>
            </div>

            <div className="preferences-section">
              <h3><FaCloudUploadAlt /> Backup Settings</h3>
              <div className="preference-item">
                <label>Backup Frequency</label>
                <select
                  value={preferences.backupFrequency}
                  onChange={(e) => handlePreferenceChange('backupFrequency', e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="preferences-section">
              <h3><FaWarehouse /> Warehouse Configuration</h3>
              <div className="warehouse-config">
                <div className="config-item">
                  <label>Length (meters)</label>
                  <input
                    type="number"
                    value={preferences.warehouseConfig.length}
                    onChange={(e) => handleWarehouseConfigChange('length', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>Width (meters)</label>
                  <input
                    type="number"
                    value={preferences.warehouseConfig.width}
                    onChange={(e) => handleWarehouseConfigChange('width', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>Height (meters)</label>
                  <input
                    type="number"
                    value={preferences.warehouseConfig.height}
                    onChange={(e) => handleWarehouseConfigChange('height', e.target.value)}
                  />
                </div>
                <div className="config-item">
                  <label>Slot Size (meters)</label>
                  <input
                    type="number"
                    value={preferences.warehouseConfig.slotSize}
                    onChange={(e) => handleWarehouseConfigChange('slotSize', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <button className="save-settings-btn">
              <FaSave /> Save All Preferences
            </button>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-settings">
            <h2><FaUserCircle /> My Profile</h2>
            
            <div className="profile-picture">
              <div className="picture-preview">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" />
                ) : (
                  <FaUserCircle size={80} />
                )}
              </div>
              <div className="picture-upload">
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="profile-upload" className="upload-btn">
                  Choose Photo
                </label>
                {profilePic && (
                  <button className="remove-btn" onClick={() => {
                    setProfilePic(null);
                    setProfilePicPreview('');
                  }}>
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="password-change">
              <h3><FaKey /> Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordChange.current}
                  onChange={(e) => setPasswordChange({
                    ...passwordChange,
                    current: e.target.value
                  })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordChange.new}
                  onChange={(e) => setPasswordChange({
                    ...passwordChange,
                    new: e.target.value
                  })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordChange.confirm}
                  onChange={(e) => setPasswordChange({
                    ...passwordChange,
                    confirm: e.target.value
                  })}
                  placeholder="Confirm new password"
                />
              </div>
              <button className="save-password-btn">
                <FaSave /> Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
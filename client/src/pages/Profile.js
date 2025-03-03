import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, loadUser } from '../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  useEffect(() => {
    // 加载用户数据
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    // 验证新密码
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setUpdateMessage('New passwords do not match');
      return;
    }
    
    // 准备更新数据
    const updateData = {
      username: formData.username,
      email: formData.email
    };
    
    // 如果提供了当前密码和新密码，则更新密码
    if (formData.currentPassword && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }
    
    // 更新个人资料
    dispatch(updateProfile(updateData));
    setIsEditing(false);
    
    // 清除密码字段
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // 显示更新消息
  useEffect(() => {
    if (message) {
      setUpdateMessage(message);
      
      // 3秒后清除消息
      const timer = setTimeout(() => {
        setUpdateMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p className="profile-subtitle">Manage your account information</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}
      
      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image">
            <img src={user?.profilePicture || '/default-profile.png'} alt="Profile" />
          </div>
          <button className="btn btn-outline" disabled>Change Photo</button>
          <p className="profile-join-date">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="profile-details-section">
          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-item">
                <h3>Username</h3>
                <p>{user?.username}</p>
              </div>
              <div className="detail-item">
                <h3>Email</h3>
                <p>{user?.email}</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="password-section">
                <h3>Change Password</h3>
                <p className="password-note">Leave blank to keep current password</p>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
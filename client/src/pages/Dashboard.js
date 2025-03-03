import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserMusicHistory } from '../redux/slices/musicSlice';
import { getTokenBalance } from '../redux/slices/tokenSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { userHistory, loading: musicLoading } = useSelector(state => state.music);
  const { balance, loading: tokenLoading } = useSelector(state => state.tokens);
  
  useEffect(() => {
    // 获取用户的音乐历史和代币余额
    dispatch(getUserMusicHistory());
    dispatch(getTokenBalance());
  }, [dispatch]);
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Token Balance</h3>
            {tokenLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="token-display">
                <span className="token-icon">🪙</span>
                <span className="token-amount">{balance}</span>
                <Link to="/tokens/purchase" className="btn btn-sm btn-outline">Buy More</Link>
              </div>
            )}
          </div>
          <div className="stat-card">
            <h3>Created Tracks</h3>
            <p className="track-count">{userHistory?.length || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <section className="recent-tracks">
          <div className="section-header">
            <h2>Your Recent Tracks</h2>
            <Link to="/create" className="btn btn-primary">Create New Track</Link>
          </div>
          
          {musicLoading ? (
            <div className="loading-container">Loading your tracks...</div>
          ) : userHistory?.length > 0 ? (
            <div className="music-grid">
              {userHistory.map(track => (
                <div key={track._id} className="music-card">
                  <h3 className="music-title">{track.title}</h3>
                  <p className="music-details">
                    <span className="music-genre">{track.genre}</span> • 
                    <span className="music-mood">{track.mood}</span> • 
                    <span className="music-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </p>
                  <audio controls src={track.audioUrl} className="music-player"></audio>
                  <div className="music-actions">
                    <button className="btn btn-sm btn-outline">Download</button>
                    <button className="btn btn-sm btn-outline">Share</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <p>You haven't created any music tracks yet.</p>
              <Link to="/create" className="btn btn-primary">Create Your First Track</Link>
            </div>
          )}
        </section>
        
        <section className="token-history">
          <h2>Token Activity</h2>
          <div className="token-actions">
            <Link to="/tokens/purchase" className="btn btn-primary">Purchase Tokens</Link>
          </div>
          <p className="token-info">
            You currently have <strong>{balance} tokens</strong>. Each music generation costs 1 token.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
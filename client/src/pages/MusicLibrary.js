import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicLibrary, setCurrentPage } from '../redux/slices/musicSlice';

const MusicLibrary = () => {
  const dispatch = useDispatch();
  const { publicLibrary, totalPublicTracks, currentPage, loading, error } = useSelector(state => state.music);
  const [limit] = useState(10);
  
  useEffect(() => {
    // Fetch public music library when component mounts
    dispatch(getPublicLibrary({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);
  
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalPublicTracks / limit);
  
  return (
    <div className="music-library-page">
      <div className="page-header">
        <h1>Music Library</h1>
        <p className="library-subtitle">Discover music created by the PumpMusic community</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="loading-container">Loading music library...</div>
      ) : (
        <>
          {publicLibrary.length === 0 ? (
            <div className="empty-library">
              <p>No music tracks available in the library yet.</p>
            </div>
          ) : (
            <div className="music-grid">
              {publicLibrary.map(track => (
                <div key={track._id} className="music-card">
                  <h3 className="music-title">{track.title}</h3>
                  <p className="music-creator">By {track.creator.username}</p>
                  <p className="music-details">
                    <span className="music-genre">{track.genre}</span> • 
                    <span className="music-mood">{track.mood}</span> • 
                    <span className="music-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </p>
                  <audio controls src={track.audioUrl} className="music-player"></audio>
                  <div className="music-stats">
                    <span className="music-plays">🎧 {track.plays}</span>
                    <span className="music-likes">❤️ {track.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                className="pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MusicLibrary;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateMusic } from '../redux/slices/musicSlice';
import { getTokenBalance, updateBalanceAfterGeneration } from '../redux/slices/tokenSlice';

const CreateMusic = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    title: '',
    genre: 'other',
    mood: 'other',
    isPublic: true
  });
  
  const { prompt, title, genre, mood, isPublic } = formData;
  const dispatch = useDispatch();
  const { generating, currentMusic, error, message } = useSelector(state => state.music);
  const { balance, loading: tokenLoading } = useSelector(state => state.tokens);
  
  useEffect(() => {
    // Get user's token balance when component mounts
    dispatch(getTokenBalance());
  }, [dispatch]);
  
  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    // Check if user has enough tokens
    if (balance < 1) {
      alert('You do not have enough tokens. Please purchase more tokens.');
      return;
    }
    
    // Generate music
    dispatch(generateMusic(formData));
  };
  
  // Update token balance in UI after generation
  useEffect(() => {
    if (currentMusic && message === 'Music generated successfully') {
      dispatch(updateBalanceAfterGeneration(balance - 1));
    }
  }, [currentMusic, message, balance, dispatch]);
  
  return (
    <div className="create-music-page">
      <div className="page-header">
        <h1>Create Music with AI</h1>
        <p className="token-info">
          Available Tokens: <span className="token-count">{balance}</span>
        </p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      
      <div className="create-music-container">
        <div className="music-form-container">
          <form className="music-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="prompt">Describe Your Music</label>
              <textarea
                id="prompt"
                name="prompt"
                className="form-control"
                value={prompt}
                onChange={handleChange}
                placeholder="E.g., A relaxing piano melody with soft strings in the background, perfect for meditation"
                required
                rows="4"
              ></textarea>
              <small className="form-text">Be as descriptive as possible for better results.</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title (Optional)</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={title}
                onChange={handleChange}
                placeholder="Give your music a title"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  className="form-control"
                  value={genre}
                  onChange={handleChange}
                >
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="jazz">Jazz</option>
                  <option value="classical">Classical</option>
                  <option value="electronic">Electronic</option>
                  <option value="ambient">Ambient</option>
                  <option value="hip-hop">Hip-Hop</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="mood">Mood</label>
                <select
                  id="mood"
                  name="mood"
                  className="form-control"
                  value={mood}
                  onChange={handleChange}
                >
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="energetic">Energetic</option>
                  <option value="calm">Calm</option>
                  <option value="dark">Dark</option>
                  <option value="uplifting">Uplifting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group form-check">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                className="form-check-input"
                checked={isPublic}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Make this music public in the library
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={generating || tokenLoading || balance < 1}
              >
                {generating ? 'Generating...' : 'Generate Music (1 Token)'}
              </button>
            </div>
          </form>
        </div>
        
        {currentMusic && (
          <div className="music-preview">
            <h2>Your Generated Music</h2>
            <div className="music-card">
              <h3>{currentMusic.title}</h3>
              <p className="music-details">
                <span className="music-genre">{currentMusic.genre}</span> • 
                <span className="music-mood">{currentMusic.mood}</span> • 
                <span className="music-duration">{Math.floor(currentMusic.duration / 60)}:{(currentMusic.duration % 60).toString().padStart(2, '0')}</span>
              </p>
              <audio controls src={currentMusic.audioUrl} className="music-player"></audio>
              <div className="music-actions">
                <a href={currentMusic.audioUrl} download className="btn btn-secondary">
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMusic;
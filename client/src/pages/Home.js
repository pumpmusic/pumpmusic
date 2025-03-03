import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Create Unique Music with AI</h1>
          <p className="hero-subtitle">
            PumpMusic uses advanced AI to generate original music tracks based on your text descriptions.
          </p>
          {isAuthenticated ? (
            <Link to="/create" className="btn btn-primary btn-lg">
              Create Music Now
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3>Describe Your Music</h3>
            <p>Enter a detailed text prompt describing the music you want to create.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>AI Generation</h3>
            <p>Our AI model transforms your description into a unique music track.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Save & Share</h3>
            <p>Download your creation or share it with the PumpMusic community.</p>
          </div>
        </div>
      </section>

      <section className="token-system">
        <h2 className="section-title">Token System</h2>
        <p className="section-description">
          PumpMusic operates on a token-based system. Each music generation costs tokens, which you can earn or purchase.
        </p>
        <div className="token-info">
          <div className="token-card">
            <h3>New Users</h3>
            <p>Get 5 free tokens when you sign up</p>
          </div>
          <div className="token-card">
            <h3>Purchase</h3>
            <p>Buy token packages to generate more music</p>
          </div>
          <div className="token-card">
            <h3>Community</h3>
            <p>Earn tokens by participating in the community</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to create your own AI-generated music?</h2>
        {isAuthenticated ? (
          <Link to="/create" className="btn btn-primary btn-lg">
            Start Creating
          </Link>
        ) : (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseTokens, getTokenBalance } from '../redux/slices/tokenSlice';
import { Link } from 'react-router-dom';

const TokenPurchase = () => {
  const dispatch = useDispatch();
  const { balance, loading, error, message } = useSelector(state => state.tokens);
  
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [purchaseStatus, setPurchaseStatus] = useState('');
  
  // 预设的代币包选项
  const tokenPackages = [
    { amount: 10, price: 4.99, popular: false },
    { amount: 25, price: 9.99, popular: true },
    { amount: 50, price: 17.99, popular: false },
    { amount: 100, price: 29.99, popular: false }
  ];
  
  useEffect(() => {
    // 获取用户当前代币余额
    dispatch(getTokenBalance());
  }, [dispatch]);
  
  // 处理代币包选择
  const handlePackageSelect = (amount) => {
    setSelectedAmount(amount);
  };
  
  // 处理代币购买
  const handlePurchase = () => {
    dispatch(purchaseTokens(selectedAmount));
  };
  
  // 显示购买状态消息
  useEffect(() => {
    if (message) {
      setPurchaseStatus(message);
      
      // 3秒后清除消息
      const timer = setTimeout(() => {
        setPurchaseStatus('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <div className="token-purchase-page">
      <div className="page-header">
        <h1>Purchase Tokens</h1>
        <p className="purchase-subtitle">Buy tokens to generate more AI music</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {purchaseStatus && <div className="alert alert-success">{purchaseStatus}</div>}
      
      <div className="token-balance-display">
        <h3>Current Balance</h3>
        <div className="balance-container">
          <span className="token-icon">🪙</span>
          <span className="token-amount">{loading ? 'Loading...' : balance}</span>
          <span className="token-label">tokens</span>
        </div>
      </div>
      
      <div className="token-packages">
        <h3>Select Package</h3>
        <div className="package-grid">
          {tokenPackages.map(pkg => (
            <div 
              key={pkg.amount}
              className={`package-card ${selectedAmount === pkg.amount ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
              onClick={() => handlePackageSelect(pkg.amount)}
            >
              {pkg.popular && <div className="popular-badge">Most Popular</div>}
              <div className="package-tokens">
                <span className="token-icon">🪙</span>
                <span className="token-amount">{pkg.amount}</span>
              </div>
              <div className="package-price">${pkg.price}</div>
              <div className="package-value">${(pkg.price / pkg.amount).toFixed(2)} per token</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="purchase-summary">
        <h3>Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Package</span>
            <span>{selectedAmount} tokens</span>
          </div>
          <div className="summary-row">
            <span>Price</span>
            <span>${tokenPackages.find(pkg => pkg.amount === selectedAmount)?.price.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${tokenPackages.find(pkg => pkg.amount === selectedAmount)?.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="purchase-actions">
        <button 
          className="btn btn-primary btn-lg"
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Purchase Now'}
        </button>
        <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
      </div>
      
      <div className="purchase-info">
        <h3>About Tokens</h3>
        <p>
          Tokens are used to generate AI music on PumpMusic. Each music generation costs 1 token.
          Purchased tokens never expire and can be used at any time.
        </p>
      </div>
    </div>
  );
};

export default TokenPurchase;
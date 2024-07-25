import React, { useState } from 'react';
import '../styles/myPage.scss';

const Webstore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleDeleteAccount = () => {
    alert('Are you sure you want to delete your account? This action cannot be undone.');
  };

  return (
    <div className="page-container">
      <div className="tabs">
        <button
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          User Details
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Purchase History
        </button>
      </div>
      <div className="content">
        {activeTab === 'details' && (
          <article id="userForm">
            <div>
              <h2>User Page</h2>
            </div>
            <div>
              <input
                type="text"
                placeholder="Current E-Mail"
                value="mattias-lindblad@hotmail.se"
                readOnly
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="New E-Mail"
                value={newEmail}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <input type="button" value="Save Settings" id="registerButton" />
            </div>
            <div>
              <button className="delete-button" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </article>
        )}
        {activeTab === 'history' && (
          <article id="purchaseHistory">
            <div>
              <h2>Purchase History</h2>
            </div>
            <div>
              <p>No purchase history available.</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default Webstore;

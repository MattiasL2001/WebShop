import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { deleteUser, ChangePassword } from '../services/webShopServices';
import '../styles/myPage.scss';

const Webstore: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSaveSettings = async () => {
    if (!newPassword.trim()) {
      setPasswordError('New password cannot be empty.');
      alert('New password cannot be empty.');
      return;
    }

    if (user?.email) {
      try {
        await ChangePassword(user.email, newPassword);
        alert('Password updated successfully.');
        setNewPassword('');
        setPasswordError(null);
      } catch (error) {
        alert('Failed to update password. Please try again.');
        console.error('Error updating password:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmed && user?.email) {
      try {
        await deleteUser(user.email);
        alert('Your account has been deleted.');
        localStorage.removeItem("jwtToken");
        navigate("/home");
        window.location.reload();
      } catch (error) {
        alert('Failed to delete the account. Please try again.');
        console.error('Error deleting account:', error);
      }
    }
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
              <h2>{user?.name}</h2>
            </div>
            <div>
              <input
                type="text"
                placeholder="Current E-Mail"
                value={user?.email || ''}
                readOnly
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <div>
              <input
                type="button"
                value="Save Settings"
                id="registerButton"
                onClick={handleSaveSettings}
              />
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

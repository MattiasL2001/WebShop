import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { deleteUser, ChangePassword, getOrdersByEmail, fetchProductById } from '../services/webShopServices';
import '../styles/myPage.scss';

interface Order {
  id: number;
  email: string;
  items: { id: number; productId: number; quantity: number; orderId: number }[];
  shippingAddress: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const Webstore: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<{ [key: number]: Product }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'history' && user?.email) {
        setLoading(true);
        try {
          const fetchedOrders: any = await getOrdersByEmail(user.email);
          setOrders(fetchedOrders);
  
          // Använd en Map för att lagra unika produkter istället för Set
          const productMap = new Map<number, Product>();
  
          for (const order of fetchedOrders) {
            for (const item of order.items) {
              if (!productMap.has(item.productId)) {
                const product = await fetchProductById(item.productId);
                productMap.set(item.productId, product);
              }
            }
          }
  
          // Konvertera Map till ett vanligt objekt för state-hantering
          const productDataObject: { [key: number]: Product } = Object.fromEntries(productMap);
          setProductData(productDataObject);
  
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchOrders();
  }, [activeTab, user?.email]);
  

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
        localStorage.removeItem('jwtToken');
        navigate('/home');
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
              <input type="text" placeholder="Current E-Mail" value={user?.email || ''} readOnly />
            </div>
            <div>
              <input type="password" placeholder="New Password" value={newPassword} onChange={handlePasswordChange} />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <div>
              <input type="button" value="Save Settings" id="registerButton" onClick={handleSaveSettings} />
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
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <ul>
                {orders.map((order) => {
                  const orderTotal = order.items.reduce((sum, item) => {
                    const product = productData[item.productId];
                    return sum + (product ? product.price * item.quantity : 0);
                  }, 0);

                  return (
                    <li className='order' key={order.id}>
                      <strong>Order ID:</strong> {order.id} <br />
                      <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()} <br />
                      <strong>Items:</strong>
                      <ul>
                        {order.items.map((item) => {
                          const product = productData[item.productId];
                          return (
                            <li key={item.id}>
                              {product ? `${product.name} x${item.quantity}` : 'Unknown Product'}
                            </li>
                          );
                        })}
                      </ul>
                      <strong>Total Price:</strong> {orderTotal.toFixed(2)} $
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No purchase history available.</p>
            )}
          </article>
        )}
      </div>
    </div>
  );
};

export default Webstore;

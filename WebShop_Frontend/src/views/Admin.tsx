import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

export type Product = {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  Image: string | null;
  ProductAmount: number;
  ProductType: number;
  ProductColor: number;
  ProductGender: number;
};

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const isUserAdmin: boolean = true; // Set to true to test admin access

  useEffect(() => {
    if (!isUserAdmin) {
      navigate('/home');
    }
    else {
      window.scrollTo(0, 0);
    }
  }, [isUserAdmin, navigate]);

  if (!isUserAdmin) {
    return null;
  }

  const handleTabChange = (tab: 'users' | 'products') => {
    setActiveTab(tab);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  const products: Product[] = [
    {
      Id: 1,
      Name: 'Product A',
      Description: 'Description for Product A',
      Price: 19.99,
      Image: null,
      ProductAmount: 100,
      ProductType: 1,
      ProductColor: 1,
      ProductGender: 1,
    },
    {
      Id: 2,
      Name: 'Product B',
      Description: 'Description for Product B',
      Price: 29.99,
      Image: null,
      ProductAmount: 50,
      ProductType: 2,
      ProductColor: 2,
      ProductGender: 2,
    },
  ];

  return (
    <>
      <div className="admin-page">
        <main className="admin-main">
          <section className="admin-section">
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard. Use the navigation above to manage the webshop.</p>
          </section>
          <div className="tabs">
            <button
              className={activeTab === 'users' ? 'tab active' : 'tab'}
              onClick={() => handleTabChange('users')}
            >
              Users
            </button>
            <button
              className={activeTab === 'products' ? 'tab active' : 'tab'}
              onClick={() => handleTabChange('products')}
            >
              Products
            </button>
          </div>
          {activeTab === 'users' && (
            <section className="admin-section">
              <h2>Users</h2>
              <ul className="item-list">
                {users.map((user) => (
                  <li key={user.id} className="item">
                    <span>{user.name}</span>
                    <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="delete-button">Delete</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {activeTab === 'products' && (
            <section className="admin-section">
              <h2>Products</h2>
              <ul className="item-list">
                {products.map((product) => (
                  <li key={product.Id} className="item">
                    <div className="product-details">
                      <h3>{product.Name}</h3>
                      <p>{product.Description}</p>
                      <p>Price: ${product.Price.toFixed(2)}</p>
                      <p>Amount: {product.ProductAmount}</p>
                      <p>Type: {product.ProductType}</p>
                      <p>Color: {product.ProductColor}</p>
                      <p>Gender: {product.ProductGender}</p>
                    </div>
                    <div className="product-actions">
                      <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="delete-button">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
      {editItem && (
        <Modal show={showModal} onClose={handleCloseModal}>
          <form className="edit-form">
            {Object.keys(editItem).map((key) => (
              <div key={key} className="form-group">
                <label>{key}</label>
                <input type="text" value={editItem[key] ?? ''} readOnly />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="save-button">Save</button>
              <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Admin;

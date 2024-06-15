import React from 'react';
import '../styles/styles.css';

const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div id="logo">
          <a href="/">Webshop Admin</a>
        </div>
        <nav>
          <div id="nav-left">
            <a href="/admin/products">Products</a>
            <a href="/admin/orders">Orders</a>
            <a href="/admin/users">Users</a>
          </div>
          <div id="nav-right">
            <button id="logoutButton">Logout</button>
          </div>
        </nav>
      </header>
      <main className="admin-main">
        <section className="admin-section">
          <h1>Dashboard</h1>
          <p>Welcome to the admin dashboard. Use the navigation above to manage the webshop.</p>
        </section>
        <section className="admin-section">
          <h2>Products</h2>
          <button className="add-button">Add New Product</button>
          {/* Product list will go here */}
        </section>
        <section className="admin-section">
          <h2>Orders</h2>
          {/* Order list will go here */}
        </section>
        <section className="admin-section">
          <h2>Users</h2>
          {/* User list will go here */}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;

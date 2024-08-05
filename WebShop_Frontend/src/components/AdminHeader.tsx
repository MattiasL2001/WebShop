import React from 'react';
import "../styles/header.scss";

const AdminHeader: React.FC = () => {

  return (
    <header className={`admin-header sticky`}>
      <div id="logo-admin">
        <a href="/">Home</a>
      </div>
      <nav>
        <div id="nav-right-logout">
          <button id="logoutButton">Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;

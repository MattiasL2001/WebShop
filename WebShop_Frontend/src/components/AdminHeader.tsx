import React from 'react';
import { useLogout } from './useLogout';
import "../styles/header.scss";

const AdminHeader: React.FC = () => {
  const logout = useLogout();

  return (
    <header className={`admin-header sticky`}>
      <div id="logo-admin">
        <a href="/">Home</a>
      </div>
      <nav>
        <div id="nav-right-logout">
          <button id="logoutButton" onClick={logout}>Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;

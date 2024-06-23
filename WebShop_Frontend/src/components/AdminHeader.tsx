import React, { useState } from 'react';
import "../styles/header.scss"

const AdminHeader: React.FC = () => {
  const [isSidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  

  const toggleSidebarMenu = () => {
    setSidebarMenuOpen(!isSidebarMenuOpen);
    if (!isSidebarMenuOpen) {
      setSidebarMenuOpen(false);
    }
  };

  return (
    <header className="admin-header">
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

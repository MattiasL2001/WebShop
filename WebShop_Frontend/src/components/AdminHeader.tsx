import React, { useState, useEffect } from 'react';
import "../styles/header.scss";

const AdminHeader: React.FC = () => {
  const [isSidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 77) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebarMenu = () => {
    setSidebarMenuOpen(!isSidebarMenuOpen);
    if (!isSidebarMenuOpen) {
      setSidebarMenuOpen(false);
    }
  };

  return (
    <header className={`admin-header ${isSticky ? 'sticky' : ''}`}>
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

import React, { useEffect, useState } from 'react';
import Navbar from './partialComponents/Navbar';
import { Link } from 'react-router-dom';
import LoginMenu from './partialComponents/LoginMenu';
import CartMenu from './partialComponents/CartMenu';
import SidebarMenu from './partialComponents/SidebarMenu';
import "../styles/header.scss"
import "../styles/sidePanel.scss"

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartMenuOpen, setCartMenuOpen] = useState(false);
  const [isLoginMenuOpen, setLoginMenuOpen] = useState(false);
  const [isSidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const toggleCartMenu = () => {
    setCartMenuOpen(!isCartMenuOpen);
    if (!isCartMenuOpen) {
      setLoginMenuOpen(false);
      setSidebarMenuOpen(false);
    }
  };

  const toggleLoginMenu = () => {
    setLoginMenuOpen(!isLoginMenuOpen);
    if (!isLoginMenuOpen) {
      setCartMenuOpen(false);
      setSidebarMenuOpen(false);
    }
  };

  const toggleSidebarMenu = () => {
    setSidebarMenuOpen(!isSidebarMenuOpen);
    if (!isSidebarMenuOpen) {
      setLoginMenuOpen(false);
      setCartMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 77);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isCartMenuOpen || isLoginMenuOpen || isSidebarMenuOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [isCartMenuOpen, isLoginMenuOpen, isSidebarMenuOpen]);

  return (
    <div>
      <header className={isScrolled ? 'header scrolled' : ''}>
        <div id="logo">
          <Link to="/">Webstore.com</Link>
        </div>
      </header>

      <Navbar
        IsScrolled={isScrolled}
        toggleCartMenu={toggleCartMenu}
        toggleLoginMenu={toggleLoginMenu}
        toggleSidebarMenu={toggleSidebarMenu}
      />

      {isCartMenuOpen && <CartMenu toggleCartMenu={toggleCartMenu} />}
      {isSidebarMenuOpen && <SidebarMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} toggleSidebarMenu={toggleSidebarMenu} />}
      {isLoginMenuOpen && <LoginMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} toggleLoginMenu={toggleLoginMenu} />}
    </div>
  );
};

export default Header;

import React, { useState } from 'react';
import Navbar from './partial components/Navbar';
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { GetProducts } from '../services/webShopServices';
import LoginMenu from '../components/partial components/LoginMenu';
import CartMenu from '../components/partial components/CartMenu';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartMenuOpen, setCartMenuOpen] = useState(false);
  const [isLoginMenuOpen, setLoginMenuOpen] = useState(false);
  
  const toggleCartMenu = () => {
    setCartMenuOpen(!isCartMenuOpen);
    if (!isCartMenuOpen) {
      setLoginMenuOpen(false);
    }
  };

  const toggleLoginMenu = () => {
    setLoginMenuOpen(!isLoginMenuOpen);
    if (!isLoginMenuOpen) {
      setCartMenuOpen(false);
    }
  };

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', isLoggedIn],
    queryFn: async () => {
      return await GetProducts();
    }
  });

  if (products) {
    for (let i = 0; i < products.length; i++) {
      console.log(products[i].name);
    }
  }

  return (
    <div>
      <header>
        <div id="logo">
          <Link to="/">Webstore.com</Link>
        </div>
      </header>

      <Navbar
        IsCartMenuOpen={isCartMenuOpen}
        IsLoginMenuOpen={isLoginMenuOpen}
        toggleCartMenu={toggleCartMenu}
        toggleLoginMenu={toggleLoginMenu}
      />

      {isCartMenuOpen && <CartMenu toggleCartMenu={toggleCartMenu} />}
      {isLoginMenuOpen && <LoginMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}

      <div id="sidebar">
        <div>
          <br />
          <br />
          <div>
            <Link to="/">Shop</Link>
            <input type="image" src="img/shopping-cart_3_white.png" alt="Shop" />
          </div>
          <br />
          <div>
            <Link to="#">Cart</Link>
            <input type="image" src="img/shopping-cart_3_white.png" alt="Cart" />
          </div>
          <br />
          <div id="sidebarLogin"></div>
          <br />
          <div id="sidebarCart"></div>
          <div id="basketDiv"></div>
          <br />
          <div>
            <Link to="/support">Support</Link>
            <input type="image" src="img/char.png" alt="Support" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

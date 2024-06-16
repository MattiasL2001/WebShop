import React from 'react';
import { Link } from 'react-router-dom';
import { NavProps } from '../models/props/nav';
import searchIcon from '../../images/search_black.png';
import shoppingCartIcon from '../../images/WebShop Bag Logo White.png';
import charIcon from '../../images/char.png';
import menuIcon from '../../images/menu-icon.png';
import { useCart } from "../Cart";

const Navbar: React.FC<NavProps> = ({ IsCartMenuOpen, IsLoginMenuOpen, toggleCartMenu, toggleLoginMenu }) => {
  const { cart } = useCart(); // Use the cart context to get the cart items
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0); // Calculate total quantity

  return (
    <nav>
      <div id="nav-left">
        <Link to="/" id="shop">SHOP</Link>
        <Link to="/support" id="support">SUPPORT</Link>
      </div>

      <div id="nav-right">
        <div id="search" style={{ position: 'relative' }}>
          <input type="search" placeholder=" SEARCH" id="input-box" />
          <a href="#"><img src={searchIcon} alt="Search" /></a>
        </div>
        <button id="cartButton" onClick={toggleCartMenu} style={{ position: 'relative' }}>
          <img src={shoppingCartIcon} alt="Cart" id="cart" />
          {cartItemCount > 0 && (
            <span style={bubbleStyle}>{cartItemCount}</span>
          )}
        </button>
        <button onClick={toggleLoginMenu}>
          <img src={charIcon} alt="User" id="char" />
        </button>
        <img src={menuIcon} alt="Menu" id="menu-icon" />
      </div>
    </nav>
  );
};

const bubbleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '50%',
  padding: '0',
  width: '20px',
  height: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default Navbar;

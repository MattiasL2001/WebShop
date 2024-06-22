import React from 'react';
import { Link } from 'react-router-dom';
import { NavProps } from '../models/props/nav';
import searchIcon from '../../images/search_black.png';
import shoppingCartIcon from '../../images/WebShop Bag Logo White.png';
import charIcon from '../../images/char.png';
import menuIcon from '../../images/menu-icon.png';
import { useCart } from "../Cart";

const Navbar: React.FC<NavProps> = ({ IsCartMenuOpen, IsLoginMenuOpen, IsSidebarMenuOpen, toggleCartMenu, toggleLoginMenu, toggleSidebarMenu }) => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

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
            <span id='cartAmountBubble'>{cartItemCount}</span>
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

export default Navbar;

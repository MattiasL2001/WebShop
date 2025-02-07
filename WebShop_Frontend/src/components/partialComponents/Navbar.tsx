import React from 'react';
import { Link } from 'react-router-dom';
import { NavProps } from '../models/props/nav';
import { useCart } from "../Cart";
import useSearch from "../Search";
import MenuIcon from "../../Icons/MenuIcon"
import BasketIcon from '../../Icons/BasketIcon';
import CharIcon from '../../Icons/CharIcons';
import SearchIcon from '../../Icons/SearchIcon';

const Navbar: React.FC<NavProps> = ({ IsScrolled, toggleCartMenu, toggleLoginMenu, toggleSidebarMenu }) => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const { searchTerm, handleSearchChange, handleKeyDown, handleSearchClick } = useSearch();

  return (
    <nav className={IsScrolled ? 'navbar scrolled' : 'navbar'}>
      <div id="nav-left">
        <Link to="/products" id="shop">SHOP</Link>
        <Link to="/support" id="support">SUPPORT</Link>
      </div>

      <div id="nav-right">
        <div id="search" style={{ position: 'relative' }}>
          <input
            type="search"
            placeholder=" SEARCH"
            id="input-box"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}>
            <SearchIcon />
          </a>
        </div>
        <button id="cartButton" onClick={toggleCartMenu} style={{ position: 'relative' }}>
          <BasketIcon id='cart' />
        {cartItemCount > 0 && (
            <span id='cartAmountBubble'>{cartItemCount}</span>
          )}
        </button>
        <button onClick={toggleLoginMenu}>
          <CharIcon />
        </button>
        <button id='sidebarButton' onClick={toggleSidebarMenu} style={{ position: 'relative' }}>
          <MenuIcon />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

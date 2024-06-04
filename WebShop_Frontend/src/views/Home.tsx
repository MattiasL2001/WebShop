import React, { useState } from 'react';
import '../styles/styles.css';
import '../styles/index.css';
import searchIcon from '../images/search_black.png';
import charIcon from '../images/char.png';
import shoppingCartIcon from '../images/shopping-cart_3_white.png';
import menuIcon from '../images/menu-icon.png';

const Webstore: React.FC = () => {
  const [isCartMenuOpen, setCartMenuOpen] = useState(false);
  const [isLoginMenuOpen, setLoginMenuOpen] = useState(false);

  const navLeftClick = (id: string) => {
    console.log(`${id} clicked`);
  };

  const navLeftOut = (id: string) => {
    console.log(`${id} mouse out`);
  };

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

  return (
    <>
      <header>
        <div id="logo">
          <a href="#">Webstore.com</a>
        </div>
      </header>

      <nav>
        <div id="nav-left">
          <a
            href="index.html"
            onMouseDown={() => navLeftClick('shop')}
            onMouseOut={() => navLeftOut('shop')}
            id="shop"
          >
            SHOP
          </a>
          <a
            href="support.html"
            onMouseDown={() => navLeftClick('support')}
            onMouseOut={() => navLeftOut('support')}
            id="support"
          >
            SUPPORT
          </a>
        </div>

        <div id="nav-right">
          <div id="search">
            <input type="search" placeholder=" SEARCH" id="input-box" />
            <input type="image" value="" id="input-logo" src={searchIcon} alt="Search" />
          </div>
          <button onClick={toggleCartMenu}>
            <img src={shoppingCartIcon} alt="Cart" id="cart" />
          </button>
          <button onClick={toggleLoginMenu}>
            <img src={charIcon} alt="User" id="char" />
          </button>
          <img src={menuIcon} alt="Menu" id="menu-icon" />
        </div>
      </nav>

      {isCartMenuOpen && (
        <div id="cartMenu">
          <div id="cartContent">
            <div>
              <p>Cart:</p>
            </div>
          </div>
          <div>
            <div>
              <input type="button" value="Basket" id="basketButton" />
            </div>
          </div>
        </div>
      )}

      {isLoginMenuOpen && (
        <div id="loginMenu">
          <div>
            <div>
              <div>
                <p>Login:</p>
              </div>
              <div>
                <input type="text" placeholder="E-Mail" id="email" />
              </div>
              <div>
                <input type="password" placeholder="Password" id="password" />
              </div>
              <div>
                <input type="button" value="Login" id="loginButton" />
              </div>
              <div>
                <a href="RegisterLogin.html" id="registerText">
                  New? Register
                </a>
              </div>
              <div id="welcomeText">
                <div>Hej!</div>
                <div>Namn Namn</div>
              </div>
              <div id="logOut">
                <a href="#">Logout</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="sidebar">
        <div>
          <br />
          <br />
          <div>
            <a href="index.html">Shop</a>
            <input type="image" src="img/shopping-cart_3_white.png" alt="Shop" />
          </div>
          <br />
          <div>
            <a href="#">Cart</a>
            <input type="image" src="img/shopping-cart_3_white.png" alt="Cart" />
          </div>
          <br />
          <div id="sidebarLogin"></div>
          <br />
          <div id="sidebarCart"></div>
          <div id="basketDiv"></div>
          <br />
          <div>
            <a href="support.html">Support</a>
            <input type="image" src="img/char.png" alt="Support" />
          </div>
        </div>
      </div>

      <div id="searchArticles">
        <select name="gender" className="filter" id="filterGender">
          <option value="gender">Filter By Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

        <select name="product" className="filter">
          <option value="">Filter By Product</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>

        <select name="color" className="filter">
          <option value="">Filter By Color</option>
          <option value="white">White</option>
          <option value="gray">Gray</option>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="blue">Blue</option>
          <option value="pink">Pink</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
        </select>

        <select name="sort" className="filter">
          <option value="">SORT BY</option>
          <option value="price-low">Price, lowest first</option>
          <option value="price-high">Price, highest first</option>
          <option value="name">Name</option>
        </select>
      </div>

      <section id="articles"></section>

      <footer>
        <div className="content">
          <p>
            Mattias Lindblad <br />
            EST. 2021
          </p>
        </div>
      </footer>
    </>
  );
};

export default Webstore;

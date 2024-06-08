import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import searchIcon from '../images/search_black.png';
import shoppingCartIcon from '../images/WebShop Bag Logo White.png';
import charIcon from '../images/char.png';
import menuIcon from '../images/menu-icon.png';
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { GetProducts } from '../services/webShopServices';

const Header: React.FC = () => {
  const [isCartMenuOpen, setCartMenuOpen] = useState(false);
  const [isLoginMenuOpen, setLoginMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = useQueryClient();


  let {data: products, isLoading, error} = useQuery({queryKey: ["products", isLoggedIn], queryFn: async () => {
    return await GetProducts()
  }
  });

  if (products) {
    for (let i = 0; i < products.length; i++) {
      console.log(products[i].name);
    }
  }
  

  const cartMenuRef = useRef<HTMLDivElement | null>(null);
  const loginMenuRef = useRef<HTMLDivElement | null>(null);

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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      cartMenuRef.current &&
      !cartMenuRef.current.contains(event.target as Node) &&
      loginMenuRef.current &&
      !loginMenuRef.current.contains(event.target as Node)
    ) {
      setCartMenuOpen(false);
      setLoginMenuOpen(false);
    }
  };

  return (
    <div onClick={handleClickOutside}> {/* This div listens for clicks outside of the menus */}
      <header>
        <div id="logo">
          <Link to="/">Webstore.com</Link>
        </div>
      </header>

      <nav>
        <div id="nav-left">
          <Link to="/" id="shop">
            SHOP
          </Link>
          <Link to="/support" id="support">
            SUPPORT
          </Link>
        </div>

        <div id="nav-right">
          <div id="search" style={{ position: 'relative' }}>
            <input type="search" placeholder=" SEARCH" id="input-box" />
            <a href="#">
              <img src={searchIcon} alt="Search" />
            </a>
          </div>
          <button onClick={toggleCartMenu}>
            <img src={shoppingCartIcon} alt="Cart" id="cart" />
          </button>
          <div style={{ width: "20px" }}></div>
          <button onClick={toggleLoginMenu}>
            <img src={charIcon} alt="User" id="char" />
          </button>
          <img src={menuIcon} alt="Menu" id="menu-icon" />
        </div>
      </nav>

      {isCartMenuOpen && (
        <div id="cartMenu" ref={cartMenuRef}>
          <div id="cartContent">
            <div>
              <p>Basket:</p>
            </div>
          </div>
          <div>
            <div>
              <Link to="/checkout">
                <button id="basketButton">To Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {isLoginMenuOpen && (
        <div id="loginMenu" ref={loginMenuRef}>
          <div>
            {!isLoggedIn ? (
              <>
                <div>
                  <p>Login:</p>
                </div>
                <div>
                  <input type="text" placeholder="E-Mail" id="email" className="modern-input" />
                </div>
                <div>
                  <input type="password" placeholder="Password" id="password" className="modern-input" />
                </div>
                <div>
                  <input type="button" value="Login" id="loginButton" className="modern-button" onClick={handleLogin} />
                </div>
                <br />
                <div>
                  <Link to="/register" id="registerText">
                    New? Register
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div id="welcomeText">
                  <div>Hej!</div>
                  <div>Namn Namn</div>
                </div>
                <div id="logOut">
                  <Link to="#" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

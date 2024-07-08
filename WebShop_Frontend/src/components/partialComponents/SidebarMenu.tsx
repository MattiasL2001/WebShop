import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '../Cart';
import { SidebarMenuProps } from '../models/props/sidebar';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import shirt from "../../images/products/1.png";
import closeIcon from "../../images/menu-icon_coral.png"
import searchIcon from '../../images/search_black.png';

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleSidebarMenu }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(true);

  const handleIncrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      addToCart({ ...item, quantity: item.quantity + 1 });
    }
  };

  const handleDecrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
    } else {
      handleRemove(itemId);
    }
  };

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId);
  };

  const loginMutation = useMutation({
    mutationFn: (loginUser: LoginUser) => {
      return Login(loginUser);
    },
    onSuccess: (response) => {
      console.log(response);
      setIsLoggedIn(true);
      if (location.pathname === '/register') {
        navigate('/home');
      }
    }
  });

  const getFormData = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    let form = formEvent.currentTarget;
    let email = (form.elements.namedItem("email") as HTMLInputElement).value;
    let password = (form.elements.namedItem("password") as HTMLInputElement).value;
    console.log(`${email} | ${password}`);
    loginMutation.mutate({ email: email, password: password });
  };

  const handleForgotPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Reset password link sent to: ${email}`);
    setForgotPasswordMessage('If there is an account with the given email, a reset link has been sent.');
    setEmail('');
  };

  const handleBackToLogin = () => {
    setShowForgotPasswordForm(false);
    setForgotPasswordMessage('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (location.pathname === '/mypage') {
      navigate('/home');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarMenu = document.querySelector('.sidebarMenu');
      if (sidebarMenu && !sidebarMenu.contains(event.target as Node)) {
        toggleSidebarMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSidebarMenu]);

  return (
    <div className={`sidebarMenu ${isSidebarMenuOpen ? 'open' : 'closed'}`}>
      <div className='closeButton'>
        <img src={closeIcon} alt="Close" onClick={toggleSidebarMenu} />
      </div>
      <div id="menuContent">
        <div className="loginMobileMenu">
          <div id="searchMobile" style={{ position: 'relative' }}>
            <input type="search" placeholder="SEARCH" id="input-box" />
            <a href="">
              <img src={searchIcon} alt="Search" />
            </a>
          </div>
          {!isLoggedIn && !showForgotPasswordForm && (
            <form onSubmit={getFormData}>
              <h2>Login</h2>
              <div className="form-group">
                <input name='email' type="text" placeholder="E-Mail" className="form-input" />
              </div>
              <div className="form-group">
                <input name='password' type="password" placeholder="Password" className="form-input" />
              </div>
              <div className="form-group">
                <input type="submit" value="Login" className="form-button" />
              </div>
              <div className="form-group">
                <button type="button" onClick={() => setShowForgotPasswordForm(true)} className="register-link">
                  Forgot Password
                </button>
              </div>
              <div className="form-group">
                <Link to="/register" className="register-link" onClick={toggleSidebarMenu}>
                  New? Register
                </Link>
              </div>
            </form>
          )}
          {showForgotPasswordForm && (
            <form onSubmit={handleForgotPasswordSubmit} id='forgotPasswordForm'>
              <h2>Forgot Password</h2>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input type="submit" value="Send Reset Link" className="form-button" />
              </div>
              <div className="form-group">
                <button type="button" onClick={handleBackToLogin} className="register-link">
                  Back to Login
                </button>
              </div>
              {forgotPasswordMessage && (
                <div className="form-group">
                  <p className="forgot-password-message">{forgotPasswordMessage}</p>
                </div>
              )}
            </form>
          )}
          {isLoggedIn && (
            <div id="welcome-container">
              <p>Welcome User! <Link to="/mypage" onClick={toggleSidebarMenu}>Go to My Page</Link></p>
              <button onClick={handleLogout} className="form-button">Logout</button>
            </div>
          )}
        </div>

        <div id="cartContent">
          <h2>Basket:</h2>
          <div id='cartContentItems'>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="cartItem">
                    <div className="cartItemImageContainer">
                      <img src={shirt} alt={item.name} className="cartItemImage" />
                    </div>
                    <div className="cartItemDetails">
                      <Link to={`/product/${item.id}`} className="cartItemLink">
                        <p className="cartItemName">{item.name}</p>
                      </Link>
                      <p className="cartItemPrice">Price: ${item.price}</p>
                      <p className="cartItemQuantity">Quantity: {item.quantity}</p>
                      <div className="cartItemButtons">
                        <button onClick={() => handleIncrement(item.id)}>➕</button>
                        <button onClick={() => handleDecrement(item.id)}>➖</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
            <div className="totalPrice">
              <h3>Total Price: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>
            </div>
          )}
          <div className="checkoutButtonContainer">
            <Link to="/checkout" onClick={toggleSidebarMenu}>
              <button className="checkoutButton">To Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

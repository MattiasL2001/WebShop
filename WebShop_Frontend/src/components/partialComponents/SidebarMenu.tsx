import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { SidebarMenuProps } from '../models/props/sidebar';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import { useAuth } from '../../AuthContext';
import useSearch from "../Search";
import SidebarIcon from '../../Icons/SidebarIcon';
import SearchIcon from '../../Icons/SearchIcon';

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleSidebarMenu }) => {
  const [email, setEmail] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const { isAuthenticated, user, setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarMenuOpen] = useState(true);

  const { searchTerm, handleSearchChange, handleKeyDown, handleSearchClick } = useSearch();

  const loginMutation = useMutation({
    mutationFn: (loginUser: LoginUser) => {
      return Login(loginUser);
    },
    onSuccess: (response) => {
      setAuthenticated(true);
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
    setAuthenticated(false);
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
      <div className='closeButton' onClick={toggleSidebarMenu}>
        <SidebarIcon />
      </div>
      <div id="menuContent">
        <div className="loginMobileMenu">
          <div id="searchMobile" style={{ position: 'relative' }}>
            <input
              type="search"
              placeholder="SEARCH"
              id="input-box"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <a href="#" onClick={(e) => {
              e.preventDefault();
              handleSearchClick();
              toggleSidebarMenu();
            }}>
              <SearchIcon />
            </a>
          </div>
          {!isAuthenticated && !showForgotPasswordForm && (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input type="submit" value="Submit" className="form-button" />
              </div>
              <div className="form-group">
                <button type="button" onClick={handleBackToLogin} className="form-button">
                  Back to Login
                </button>
              </div>
              {forgotPasswordMessage && <p>{forgotPasswordMessage}</p>}
            </form>
          )}
          {isAuthenticated && (
            <div id="welcome-container">
              <p>Welcome User! <Link to="/mypage" onClick={toggleSidebarMenu}>Go to My Page</Link></p>
              <button onClick={handleLogout} className="form-button">Logout</button>
            </div>
          )}
        </div>
        <div className="checkoutButtonContainer">
            <Link to="/checkout" onClick={toggleSidebarMenu}>
              <button className="checkoutButton">To Checkout</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

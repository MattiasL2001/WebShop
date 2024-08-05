import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { SidebarMenuProps } from '../models/props/sidebar';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import useSearch from "../Search";

const MenuIcon: React.FC = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      style={{
        fill: '#ff7f50',
        stroke: 'none',
        strokeWidth: 20.656,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
      d="m 14.966945,-269.30858 a 10.001,10.001 0 0 0 -10.0001479,9.99991 v 9.9999 a 10.001,10.001 0 0 0 10.0001479,10.00043 H 314.96697 a 10.001,10.001 0 0 0 9.9996,-10.00043 v -9.9999 a 10.001,10.001 0 0 0 -9.9996,-9.99991 z m 0,135.00003 a 10.001,10.001 0 0 0 -10.0001479,9.9999 v 9.99991 a 10.001,10.001 0 0 0 10.0001479,9.99991 H 314.96697 a 10.001,10.001 0 0 0 9.9996,-9.99991 v -9.99991 a 10.001,10.001 0 0 0 -9.9996,-9.9999 z m 0,135.00002697 A 10.001,10.001 0 0 0 4.9667971,10.691383 V 20.69129 A 10.001,10.001 0 0 0 14.966945,30.691196 H 314.96697 a 10.001,10.001 0 0 0 9.9996,-9.999906 v -9.999907 a 10.001,10.001 0 0 0 -9.9996,-9.99990603 z"
      transform="matrix(0.93749998,0,0,1,-4.6563722,269.30858)"
    />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="layer1">
      <path
        id="path833"
        style={{ fill: "#000000" }}
        d="M 195.95755,24.844995 C 153.07987,23.444184 111.40794,41.338298 80.236644,70.276684 19.56674,121.34159 8.8229866,215.88997 46.641437,283.59117 c 24.135419,45.91397 71.950943,75.92975 122.069003,85.44657 47.4163,7.95991 97.12371,-6.84941 134.73099,-36.21206 38.23195,38.23195 76.46388,76.4639 114.69584,114.69584 9.42802,-9.42802 18.85604,-18.85604 28.28406,-28.28406 C 408.32185,381.13798 370.22236,343.03849 332.12288,304.93901 367.87393,263.48169 377.25876,204.41498 363.22159,152.36607 345.86195,77.360452 271.2308,25.512244 195.95755,24.844995 Z m -5.42034,40.687956 c 61.30671,-1.294568 124.74008,41.392079 135.58432,103.844189 9.54694,40.67623 -0.943,85.79861 -30.74316,115.77836 -38.45904,41.78356 -105.45733,60.40633 -156.84112,31.69596 C 58.466965,282.60193 40.21047,161.37487 103.60911,103.00303 127.22969,80.464458 157.33069,65.239515 190.53721,65.532951 Z"
      />
    </g>
  </svg>
);

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isLoggedIn, setIsLoggedIn, toggleSidebarMenu }) => {
  const [email, setEmail] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarMenuOpen] = useState(true);

  const { searchTerm, handleSearchChange, handleKeyDown, handleSearchClick } = useSearch();

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
      <div className='closeButton' onClick={toggleSidebarMenu}>
        <MenuIcon />
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
          {isLoggedIn && (
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

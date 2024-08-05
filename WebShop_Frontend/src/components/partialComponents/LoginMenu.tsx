import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import { LoginMenuProps } from '../models/props/login';

const LoginMenu: React.FC<LoginMenuProps> = ({ isLoggedIn, setIsLoggedIn, toggleLoginMenu }) => {
  const [showLoginForm] = useState(true);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useMutation({
    mutationFn: (loginUser: LoginUser) => {
      return Login(loginUser);
    },
    onSuccess: (response) => {
      setIsLoggedIn(true);
      if (location.pathname === '/register') {
        navigate('/home');
      }
    },
    onError: (error: any) => {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  });

  const getFormData = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    let form = formEvent.currentTarget;
    let email = (form.elements.namedItem("email") as HTMLInputElement).value;
    let password = (form.elements.namedItem("password") as HTMLInputElement).value;
    loginMutation.mutate({ email: email, password: password });
  };

  const handleForgotPasswordLink = () => {
    setShowForgotPasswordForm(true);
    setErrorMessage("");
  }

  const handleForgotPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email != "") { setForgotPasswordMessage('If there is an account with the given email, a reset link has been sent.'); }
    else { setForgotPasswordMessage('Input field can not be empty!'); }
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
      const loginMenu = document.querySelector('.loginMenu');
      if (loginMenu && !loginMenu.contains(event.target as Node)) {
        toggleLoginMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleLoginMenu]);

  return (
    <div className={`loginBackdrop ${showLoginForm ? 'open' : ''}`}>
      {showLoginForm && (
        <div className="loginMenu">
          <div className='closeButton'>
            <button onClick={toggleLoginMenu}>×</button>
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
              {errorMessage && (
                <div className="form-group error-message">
                  <p>{errorMessage}</p>
                </div>
              )}
              <div className="form-group">
                <input type="submit" value="Login" className="form-button" />
              </div>
              <div className="form-group">
                <button type="button" onClick={handleForgotPasswordLink} className="register-link">
                  Forgot Password
                </button>
              </div>
              <div className="form-group">
                <Link to="/register" className="register-link" onClick={toggleLoginMenu}>
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
              <p>Welcome User! <Link to="/mypage" onClick={toggleLoginMenu}>Go to My Page</Link></p>
              <button onClick={handleLogout} className="form-button">Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginMenu;

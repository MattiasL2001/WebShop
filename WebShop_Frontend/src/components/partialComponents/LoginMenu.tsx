import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from "../useLogin";
import { useLogout } from "../useLogout";
import { LoginMenuProps } from '../models/props/login';
import { useAuth } from '../../AuthContext';
import { jwtDecode } from 'jwt-decode';

const LoginMenu: React.FC<LoginMenuProps> = ({ toggleLoginMenu }) => {
  const { isAuthenticated, user, setAuthenticated } = useAuth();
  const logout = useLogout();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: login } = useLogin({
    onSuccess: async (response) => {
      console.log(response);

      if (response.token) {
        const decodedToken: Record<string, any> = jwtDecode(response.token);
        console.log("JWT Claims:", decodedToken);

        const name = decodedToken['name'];
        const role = decodedToken['role'];
        const email = decodedToken['email'];
        const birthDate = decodedToken['birthdate'];

        setAuthenticated(true, { name, role, email, birthDate });

        if (location.pathname === '/register') { 
          navigate('/home'); 
        }
      } else {
        console.log("no token");
        console.log(response);
      }
    },
    onError: (error) => {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  });

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const form = formEvent.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    login({ email, password });
  };

  const handleForgotPasswordLink = () => {
    setShowForgotPasswordForm(true);
    setErrorMessage("");
  }

  const handleForgotPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== "") { 
      setForgotPasswordMessage('If there is an account with the given email, a reset link has been sent.'); 
    } else { 
      setForgotPasswordMessage('Input field cannot be empty!'); 
    }
    setEmail('');
  };

  const handleBackToLogin = () => {
    setShowForgotPasswordForm(false);
    setForgotPasswordMessage('');
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
          {!isAuthenticated && !showForgotPasswordForm && (
            <form onSubmit={handleSubmit}>
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
                <input type="submit" value="Login" className="form-button"/>
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
          {isAuthenticated && (
            <div id="welcome-container">
              <p>Welcome {user?.name.split(" ")[0]}! <Link to="/mypage" onClick={toggleLoginMenu}>Go to My Page</Link></p>
              <button onClick={logout} className="form-button">Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginMenu;

import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import { LoginMenuProps } from '../models/props/login';

const LoginMenu: React.FC<LoginMenuProps> = ({ isLoggedIn, setIsLoggedIn, toggleLoginMenu }) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const loginMutation = useMutation({
    mutationFn: (loginUser: LoginUser) => {
      return Login(loginUser);
    },
    onSuccess: (response) => {
      console.log(response);
      setIsLoggedIn(true);
      toggleLoginMenu();
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
          {!isLoggedIn && (
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
                <Link to="/register" className="register-link">
                  New? Register
                </Link>
              </div>
            </form>
          )}
          {isLoggedIn && (
            <div className="welcome-container">
              <Navigate to="/mypage" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginMenu;

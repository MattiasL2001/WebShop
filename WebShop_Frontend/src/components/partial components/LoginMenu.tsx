import React from 'react';
import { Link } from 'react-router-dom';

interface LoginMenuProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const LoginMenu: React.FC<LoginMenuProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div id="loginMenu">
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
              <input type="button" value="Login" id="loginButton" className="modern-button" onClick={() => setIsLoggedIn(true)} />
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
              <Link to="/mypage">
                My Page
              </Link>
            </div>
            <div id="logOut">
              <Link to="#" onClick={() => setIsLoggedIn(false)}>
                Logout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginMenu;

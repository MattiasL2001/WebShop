import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LoginUser } from '../models/LoginUser';
import { Login } from '../../services/webShopServices';
import { LoginMenuProps } from "../models/props/login";

const LoginMenu: React.FC<LoginMenuProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  
	const loginMutation = useMutation({
		mutationFn: (loginUser:LoginUser) => {
			return Login(loginUser) 
		},
		onSuccess: (response) => {
			console.log(response)
			setIsLoggedIn(true)
		}
	})

	const getFormData = async (formEvent: React.FormEvent<HTMLFormElement>) => {

		formEvent.preventDefault()

		let form = formEvent.currentTarget

		let email = (form.elements.namedItem("email") as HTMLInputElement).value
		let password = (form.elements.namedItem("password") as HTMLInputElement).value

		console.log(`${email} | ${password}`)

		loginMutation.mutate({email: email, password: password})

  }

  return (
    <div id="loginMenu">
      <div>
        {!isLoggedIn ? (
          <form onSubmit={getFormData}>
            <div>
              <p>Login:</p>
            </div>
            <div>
              <input name='email' type="text" placeholder="E-Mail" id="email" className="modern-input" />
            </div>
            <div>
              <input name='password' type="password" placeholder="Password" id="password" className="modern-input" />
            </div>
            <div>
              <input type="submit" value="Login" id="loginButton" className="modern-button"/>
            </div>
            <br />
            <div>
              <Link to="/register" id="registerText">
                New? Register
              </Link>
            </div>
          </form>
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

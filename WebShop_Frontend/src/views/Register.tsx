import React, { useState, useEffect } from 'react';
import "../styles/register.scss";
import { useAuth } from '../AuthContext';
import { Register } from '../services/webShopServices';
import { useNavigate } from 'react-router-dom';

const Webstore: React.FC = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    confirmPassword: false,
    birthDate: false,
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

const handleRegister = async () => {
  setErrors({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    confirmPassword: false,
    birthDate: false,
  });

  if (!firstname.trim()) {
    setErrors(prev => ({ ...prev, firstname: true }));
    alert("First Name must be filled out");
    return;
  }
  if (!lastname.trim()) {
    setErrors(prev => ({ ...prev, lastname: true }));
    alert("Last Name must be filled out");
    return;
  }
  if (!email.trim()) {
    setErrors(prev => ({ ...prev, email: true }));
    alert("Email Address must be filled out");
    return;
  }
  if (!password.trim()) {
    setErrors(prev => ({ ...prev, password: true }));
    alert("Password must be filled out");
    return;
  }
  if (!confirmPassword.trim()) {
    setErrors(prev => ({ ...prev, confirmPassword: true }));
    alert("Confirm Password must be filled out");
    return;
  }
  if (!birthDate.trim()) {
    setErrors(prev => ({ ...prev, birthDate: true }));
    alert("Birth Date must be filled out");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const registerUser = {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      birthDate,
    };

    await Register(registerUser);
    alert("Registration successful!");
    navigate("/home");
  } catch (error: any) {
    const message =
      error?.message ||
      error?.response?.data?.message ||
      "Registration failed. Please try again.";
    alert(message);
    console.error("Error during registration:", message);
  }
};

  return (
    <>
      <article id="registerForm">
        <div>
          <h2>Register</h2>
        </div>
        <br />
        <p>First Name</p>
        <div>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className={errors.firstname ? 'registerError' : ''}
            autoComplete="off"
          />
        </div>
        <p>Last Name</p>
        <div id="name2">
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={errors.lastname ? 'registerError' : ''}
            autoComplete="off"
          />
        </div>
        <p>Email Address</p>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'registerError' : ''}
            autoComplete="off"
          />
        </div>
        <p>Password</p>
        <div id="passwordLogin">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'registerError' : ''}
            autoComplete="new-password"
          />
        </div>
        <p>Confirm Password</p>
        <div id="passwordLogin">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'registerError' : ''}
            autoComplete="new-password"
          />
        </div>
        <p>Birth Date</p>
        <div>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={errors.birthDate ? 'registerError' : ''}
            min="1900-01-01"
            id="birthDate"
            autoComplete="off"
          />
        </div>
        <div>
          <input
            type="button"
            value="Register Now"
            id="registerButton"
            onClick={handleRegister}
          />
        </div>
      </article>
    </>
  );
};

export default Webstore;

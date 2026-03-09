import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import "../styles/register.scss";
import { resetPassword } from '../services/webShopServices';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();

  const handleResetPassword = async () => {

    setErrors({
      password: false,
      confirmPassword: false
    });

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

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await resetPassword(token!, password);

      alert("Password successfully updated!");
      navigate("/home");

    } catch (error) {

      alert("Invalid or expired reset link.");
      console.error("Reset password error:", error);

    }
  };

  return (
    <>
      <article id="registerForm">

        {!token ? (
          <>
            <h2>Invalid Reset Link</h2>
            <p>This reset link is invalid or missing a token.</p>
          </>
        ) : (
          <>
            <div>
              <h2>Reset Password</h2>
            </div>

            <br />

            <p>New Password</p>
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

            <div>
              <input
                type="button"
                value="Reset Password"
                id="registerButton"
                onClick={handleResetPassword}
              />
            </div>
          </>
        )}

      </article>
    </>
  );
};

export default ResetPassword;
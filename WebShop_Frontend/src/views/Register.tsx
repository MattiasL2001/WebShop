import React from 'react';
import "../styles/register.scss"

const Webstore: React.FC = () => {

  return (
    <>
      <article id="registerForm">
        <div>
          <h2>Register</h2>
        </div>
        <br></br>
        <p>First Name</p>
        <div>
          <input type="text" autoComplete="off" />
        </div>
        <p>Last Name</p>
        <div id="name2">
          <input type="text" autoComplete="off" />
        </div>
        <p>Email Adress</p>
        <div>
          <input type="text" autoComplete="off" />
        </div>
        <p>Password</p>
        <div id="passwordLogin">
          <input type="password" autoComplete="new-password" />
        </div>
        <p>Confirm Password</p>
        <div id="passwordLogin">
          <input type="password" autoComplete="new-password" />
        </div>
        <p>Birth Date</p>
        <div>
          <input type="date" min="1900-01-01" id="birthDate" autoComplete="off" />
        </div>
        <div>
          <input type="button" value="Register Now" id="registerButton" />
        </div>
      </article>
    </>
  );
};

export default Webstore;

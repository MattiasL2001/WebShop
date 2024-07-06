import React from 'react';
import "../styles/register.scss"

const Webstore: React.FC = () => {

  return (
    <>
      <article id="registerForm">
        <div>
          <h2>Register</h2>
        </div>
        <div>
          <input type="text" placeholder="Firstname" autoComplete="off" />
        </div>
        <div id="name2">
          <input type="text" placeholder="Surname" autoComplete="off" />
        </div>
        <div>
          <input type="text" placeholder="E-Mail" autoComplete="off" />
        </div>
        <div id="passwordLogin">
          <input type="password" placeholder="Password" autoComplete="new-password" />
        </div>
        <div id="passwordLogin">
          <input type="password" placeholder="Verify Password" autoComplete="new-password" />
        </div>
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

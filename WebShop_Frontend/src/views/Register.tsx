import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/styles.css';

const Webstore: React.FC = () => {

  return (
    <>

      <Header></Header>

      <article id="registerForm">
        <div>
          <h2>Register</h2>
        </div>
        <div>
          <input type="text" placeholder="Firstname" />
        </div>
        <div id="name2">
          <input type="text" placeholder="Surname" />
        </div>
        <div>
          <input type="text" placeholder="E-Mail" />
        </div>
        <div id="passwordLogin">
          <input type="password" placeholder="Password" />
        </div>
        <div>
          <h2>Birthdate</h2>
        </div>
        <div>
          <input type="date" min="1900-01-01" id="birthDate" />
        </div>
        <div>
          <input type="button" value="Register Now" id="registerButton" />
        </div>
      </article>

    </>
  );
};

export default Webstore;

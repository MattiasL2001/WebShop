import React from 'react';
import "../styles/register.scss"
import Page from '../components/Page';

const Webstore: React.FC = () => {

  return (
    <>

      <Page>
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
          <div id="passwordLogin">
            <input type="password" placeholder="Verify Password" />
          </div>
          <div>
            <input type="date" min="1900-01-01" id="birthDate" />
          </div>
          <div>
            <input type="button" value="Register Now" id="registerButton" />
          </div>
        </article>
      </Page>

    </>
  );
};

export default Webstore;

import React, { useState } from 'react';
import '../styles/myPage.scss';

const Webstore: React.FC = () => {

  return (
    <>
      <article id="userForm">
          <div>
            <h2>User Page</h2>
          </div>
          <div>
            <input type="text" placeholder="" value={"User email: mattias-lindblad@hotmail.se"} readOnly />
          </div>
          <div>
            <input type="text" placeholder="New E-Mail" />
          </div>
          <div id="passwordLogin">
            <input type="password" placeholder="Password" />
          </div>
          <div>
            <input type="button" value="Save Settings" id="registerButton" />
          </div>
        </article>
    </>
  );
};

export default Webstore;

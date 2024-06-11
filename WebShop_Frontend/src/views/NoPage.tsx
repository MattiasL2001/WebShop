import React, { useState } from 'react';
import Page from '../components/Page';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Webstore: React.FC = () => {

  return (
    <>
    
    <Page>
      <div id='noPage'>
          <div>
            <br />
            <h2>No page here!</h2>
            <br />
            <h3>Return back to the</h3>
            <Link to="/" id="homePageLink">Homepage</Link>
          </div>
        </div>
    </Page>

    </>
  );
};

export default Webstore;

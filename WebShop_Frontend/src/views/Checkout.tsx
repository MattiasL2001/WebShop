import React, { useState } from 'react';
import Header from '../components/Header';
import shoppingCartIcon from '../images/WebShop Bag Logo Coral.png';
import '../styles/styles.css';

const Webstore: React.FC = () => {

  return (
    <>

      <Header></Header>

      <article id="checkoutForm">
        <div id='checkoutArticles'>
          <div>
            <img src={shoppingCartIcon} alt="Basket" />
            <h2>Articles</h2>
          </div>
        </div>

        <div id='checkoutPayment'>

          <div>
            <img src={shoppingCartIcon} alt="Basket" />
            <h2>Checkout</h2>
          </div>
          <div id="shippingInfo">
            <input type="text" placeholder="Shipping Address" />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="ZIP Code" />
            <input type="text" placeholder="Country" />
          </div>
          <div id="paymentInfo">
            <h2>Payment Information</h2>
            <input type="text" placeholder="Card Number" />
            <input type="text" placeholder="Name on Card" />
            <input type="date" placeholder="Expiry Date" />
            <input type="text" placeholder="CVV" />
          </div>
          <div>
            <input type="button" value="Place Order" id="placeOrderButton" />
          </div>

        </div>
    </article>

    </>
  );
};

export default Webstore;

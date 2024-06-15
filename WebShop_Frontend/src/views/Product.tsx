import React from 'react';
import '../styles/product.scss';
import image from '../images/1.png';
import Page from '../components/Page';

const ProductPage: React.FC = () => {
  return (
    <Page>
      <article className="product-page">
        <div className="product-image">
          <img src={image} alt="Product image" />
        </div>
        <div className="separator"></div>
        <div className="product-details">
          <h1>Product Name</h1>
          <p>Price: $Product Price</p>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </article>
      <article className="product-description">
        <p>Product Description</p>
        <p> This is a very good product.
          I am just writing some stuff here
          so it will be a bit lengthy and so I
          can see how the design turns out.
          Please buy this product so I get money :)
        </p>
      </article>
    </Page>
  );
};

export default ProductPage;

import React from 'react';
import '../styles/product.scss';
import image from '../images/1.png';
import { useCart } from '../components/Cart';
import { CartItem } from '../components/models/props/cartItem';

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: 21,
      name: 'Product Name',
      image: null,
      description: "",
      price: 89.99,
      quantity: 1
    };
    addToCart(newItem);
  };

  return (
    <>
      <article className="product-page">
        <div className="product-image">
          <img src={image} alt="Product image" />
        </div>
        <div className="separator"></div>
        <div className="product-details">
          <h1>Product Name</h1>
          <p>Price: $99.99</p>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
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
    </>
  );
};

export default ProductPage;

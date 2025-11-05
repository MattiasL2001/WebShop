import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart';
import { CartMenuProps } from '../models/props/cart';
import { getProductImage } from '../getProductImage';
import { CartItem } from '../models/props/cartItem';

const CartMenu: React.FC<CartMenuProps> = ({ toggleCartMenu }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isCartMenuOpen] = useState(true);
  const image = getProductImage

  const handleIncrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      addToCart({ ...item, quantity: + 1 });
    }
  };

  const handleDecrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      addToCart({ ...item, quantity: - 1 });
    } else {
      handleRemove(itemId);
    }
  };

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartMenu = document.querySelector('.cartMenu');
      if (cartMenu && !cartMenu.contains(event.target as Node)) {
        toggleCartMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleCartMenu]);

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const isCheckoutPage = window.location.pathname === '/checkout';

  return (
    <div className={`cartBackdrop ${isCartMenuOpen ? 'open' : ''}`}>
      <div className={`cartMenu ${isCartMenuOpen ? 'open' : 'closed'}`}>
        <div className='closeButton'>
          <button onClick={toggleCartMenu}>×</button>
        </div>
        <div id="cartContent">
          <h2>Basket:</h2>
          {!isCheckoutPage && (
            <div id='cartContentItems'>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul>
                  {cart.map((item: CartItem) => (
                    <li key={item.id} className="cartItem">
                      <div className="cartItemImageContainer">
                        <img src={image(item.image)} alt={item.name} className="cartItemImage" />
                      </div>
                      <div className="cartItemDetails">
                        <Link to={`/products/${item.id}`} state={item} className="cartItemLink">
                          <p className="cartItemName">{item.name}</p>
                        </Link>
                        <p className="cartItemPrice">
                          Price:<br />${item.price}
                        </p>
                        <p className="cartItemQuantity">
                          Quantity:<br />{item.quantity}
                        </p>
                        <div className="cartItemButtons">
                          <button onClick={() => handleIncrement(item.id)}>➕</button>
                          <button onClick={() => handleDecrement(item.id)}>➖</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {cart.length > 0 && !isCheckoutPage && (
            <div className="totalPrice">
              <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
            </div>
          )}
          <div className="checkoutButtonContainer">
            {isCheckoutPage ? (
              <Link to="/home" onClick={toggleCartMenu}>
                <button className="checkoutButton">Continue Shopping</button>
              </Link>
            ) : (
              <Link to="/checkout" onClick={toggleCartMenu}>
                <button className="checkoutButton">To Checkout</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMenu;

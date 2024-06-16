import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart';
import { CartMenuProps } from '../models/props/cart';

const CartMenu: React.FC<CartMenuProps> = ({ toggleCartMenu }) => {
  const { cart, addToCart, removeFromCart } = useCart();

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
    }
    else { handleRemove(itemId) }
  };

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId);
  };

  return (
    <div id="cartMenu">
      <div id="cartContent">
        <div>
          <p>Basket:</p>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Link to={`/product/${item.id}`} style={{ flex: 1 }}>
                    {item.name}: {item.quantity}
                  </Link>
                  <button onClick={() => handleIncrement(item.id)} style={iconButtonStyle}>
                    ➕
                  </button>
                  <button onClick={() => handleDecrement(item.id)} style={iconButtonStyle}>
                    ➖
                  </button>
                  <button onClick={() => handleRemove(item.id)} style={iconButtonStyle}>
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <div>
          <Link to="/checkout">
            <button id="basketButton">To Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const iconButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  marginLeft: '5px',
};

export default CartMenu;

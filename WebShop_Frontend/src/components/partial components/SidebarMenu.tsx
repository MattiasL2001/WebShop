import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart';
import { SidebarMenuProps } from '../models/props/sidebar';
import shirt from '../../images/1.png';

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleSidebarMenu }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(true);

  const handleIncrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      addToCart({ ...item, quantity: item.quantity + 1 });
    }
  };

  const handleDecrement = (itemId: number) => {
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
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
        toggleSidebarMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSidebarMenu]);

  const handleToggleCartMenu = () => {
    toggleSidebarMenu();
    setIsCartMenuOpen(!isCartMenuOpen);
  };

  return (
    <div className={`cartBackdrop ${isCartMenuOpen ? 'open' : ''}`}>
      <div className={`cartMenu ${isCartMenuOpen ? 'open' : 'closed'}`}>
        <div className='closeButton'>
          <button onClick={handleToggleCartMenu}>×</button>
        </div>
        <div id="cartContent">
          <div>
            <h2>Basket:</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="cartItem">
                    <div className="cartItemImageContainer">
                      <img src={shirt} alt={item.name} className="cartItemImage" />
                    </div>
                    <div className="cartItemDetails">
                      <Link to={`/product/${item.id}`} className="cartItemLink">
                        <p className="cartItemName">{item.name}</p>
                      </Link>
                      <p className="cartItemQuantity">Quantity: {item.quantity}</p>
                      <p className="cartItemQuantity">Price: {item.price}</p>
                      <div className="cartItemButtons">
                        <button onClick={() => handleIncrement(item.id)}>➕</button>
                        <button onClick={() => handleDecrement(item.id)}>➖</button>
                        <button onClick={() => handleRemove(item.id)}>🗑️</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="checkoutButtonContainer">
          <Link to="/checkout">
            <button className="checkoutButton">To Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

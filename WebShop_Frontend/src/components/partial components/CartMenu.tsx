import React from 'react';
import { Link } from 'react-router-dom';

interface CartMenuProps {
  toggleCartMenu: () => void;
}

const CartMenu: React.FC<CartMenuProps> = ({ toggleCartMenu }) => {
  return (
    <div id="cartMenu">
      <div id="cartContent">
        <div>
          <p>Basket:</p>
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

export default CartMenu;

import React, { useEffect, useState } from 'react';
import defaultProductImage from "../images/products/1.png";
import '../styles/checkout.css';
import { CartItem } from '../components/models/props/cartItem';
import { useCart } from '../components/Cart';
import { useAuth } from '../AuthContext';
import CartIcon from '../Icons/CartIcon';
import BasketIcon from '../Icons/BasketIcon';
import ArrowIcon from '../Icons/ArrowIcon';

const Webstore: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isArticlesVisible, setIsArticlesVisible] = useState(true);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cart');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 750);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleIncrement = (itemId: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      addToCart({ ...item, quantity: +1 });
      setCartItems(cartItems.map(ci => ci.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci));
    }
  };

  const handleDecrement = (itemId: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
      setCartItems(cartItems.map(ci => ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci));
    } else {
      handleRemove(itemId);
    }
  };

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  return (
    <article id="checkoutForm">
      <div id='checkoutArticles' className={isArticlesVisible ? '' : 'collapsed'}>
        <div 
          onClick={isSmallScreen ? () => setIsArticlesVisible(!isArticlesVisible) : undefined} 
          className="toggleSection"
        >
          <CartIcon />
          <h2>Articles</h2>
          {isSmallScreen && <ArrowIcon isVisible={isArticlesVisible} />}
        </div>
        {isArticlesVisible && (
          <div>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.image || defaultProductImage} 
                    alt={item.name} 
                    className="cart-item-image"
                  />
                  <p>{item.name} - ${item.price} x {item.quantity}</p>
                  <div className="cart-item-buttons">
                    <button onClick={() => handleIncrement(item.id)}>➕</button>
                    <button onClick={() => handleDecrement(item.id)}>➖</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in the cart</p>
            )}
          </div>
        )}
      </div>

      <div id='checkoutPayment' className={isCheckoutVisible ? '' : 'collapsed'}>
        <div 
          onClick={isSmallScreen ? () => setIsCheckoutVisible(!isCheckoutVisible) : undefined} 
          className="toggleSection"
        >
          <BasketIcon color='#fa7646'/>
          <h2>Checkout</h2>
          {isSmallScreen && <ArrowIcon isVisible={isCheckoutVisible} />}
        </div>
        {isCheckoutVisible && (
          <>
            <div id="shippingInfo">
              <input type="text" placeholder="Shipping Address" />
              <input type="text" placeholder="City" />
              <input type="text" placeholder="ZIP Code" />
              <input type="text" placeholder="Country" />
            </div>
            <div id="paymentInfo">
              <h2>Payment Information</h2>
              <input type="text" value="1234 5678 9012 3456" readOnly placeholder="Card Number" />
              <input 
                type="text" 
                value={isAuthenticated ? user?.name : "User Name"} 
                readOnly 
                placeholder="Name on Card" 
              />
              <input type="month" value="2024-12" readOnly placeholder="Expiry Date" />
              <input type="text" value="123" readOnly placeholder="CVV" />
            </div>
            <div>
              <input type="button" value="Place Order" id="placeOrderButton" />
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default Webstore;

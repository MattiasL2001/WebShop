import React, { useEffect, useState } from 'react';
import shoppingBagIcon from '../images/WebShop Bag Logo Coral.png';
import shoppingCartIcon from '../images/shopping-cart-coral.png';
import defaultProductImage from "../images/products/1.png";
import '../styles/checkout.css';
import { CartItem } from '../components/models/props/cartItem';

const Webstore: React.FC = () => {
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
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ArrowIcon = ({ isVisible }: { isVisible: boolean }) => (
    <svg className='arrowIcon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={isVisible ? "M12 8l-6 6h12l-6-6z" : "M12 16l6-6H6l6 6z"}
      />
    </svg>
  );

  return (
    <article id="checkoutForm">
      <div id='checkoutArticles' className={isArticlesVisible ? '' : 'collapsed'}>
        <div 
          onClick={isSmallScreen ? () => setIsArticlesVisible(!isArticlesVisible) : undefined} 
          className="toggleSection"
        >
          <img src={shoppingCartIcon} alt="Basket" />
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
          <img src={shoppingBagIcon} alt="Basket" />
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
              <input type="text" value="User Name" readOnly placeholder="Name on Card" />
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

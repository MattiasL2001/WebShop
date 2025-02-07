import React, { useEffect, useState } from 'react';
import '../styles/checkout.css';
import { CartItem } from '../components/models/props/cartItem';
import { useCart } from '../components/Cart';
import { useAuth } from '../AuthContext';
import { placeOrder } from '../services/webShopServices';
import { getProductImage } from '../components/getProductImage';
import CartIcon from '../Icons/CartIcon';
import BasketIcon from '../Icons/BasketIcon';
import ArrowIcon from '../Icons/ArrowIcon';

const Webstore: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, removeFromCart, clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isArticlesVisible, setIsArticlesVisible] = useState(true);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const image = getProductImage;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrder = async () => {
    const { address, city, zip, country } = shippingInfo;
  
    if (!address || !city || !zip || !country) {
      alert("Please fill in all shipping details.");
      return;
    }
  
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    const orderData = {
      id: 0,
      email: user?.email || "",
      items: cartItems.map(item => ({
        id: 0,
        productId: item.id,
        quantity: item.quantity,
        orderId: 0
      })),
      shippingAddress: address,
      city,
      zip,
      country,
      phone: "",
      createdAt: new Date().toISOString()
    };
  
    console.log("Sending order data:", orderData);
  
    try {
      await placeOrder(orderData);
      setPurchasedItems(cartItems);
      setOrderConfirmed(true);
      clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  };  

  if (orderConfirmed) {
    return (
      <div className="order-confirmation">
        <h1>Thank you for your purchase!</h1>
        <p>Your order has been placed successfully.</p>
        <h2>Items Purchased:</h2>
        <ul>
          {purchasedItems.map((item) => (
            <li key={item.id}>{item.name} - ${item.price} x {item.quantity}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <article id="checkoutForm">
      <div id='checkoutArticles' className={isArticlesVisible ? '' : 'collapsed'}>
        <div onClick={isSmallScreen ? () => setIsArticlesVisible(!isArticlesVisible) : undefined} className="toggleSection">
          <CartIcon />
          <h2>Articles</h2>
          {isSmallScreen && <ArrowIcon isVisible={isArticlesVisible} />}
        </div>
        {isArticlesVisible && (
          <div>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={image(item.image)} alt={item.name} className="cart-item-image" />
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
        <div onClick={isSmallScreen ? () => setIsCheckoutVisible(!isCheckoutVisible) : undefined} className="toggleSection">
          <BasketIcon color='#fa7646'/>
          <h2>Checkout</h2>
          {isSmallScreen && <ArrowIcon isVisible={isCheckoutVisible} />}
        </div>
        {isCheckoutVisible && (
          <>
          <div id="shippingInfo">
            <input type="text" name="address" placeholder="Shipping Address" onChange={handleInputChange} />
            <input type="text" name="city" placeholder="City" onChange={handleInputChange} />
            <input type="text" name="zip" placeholder="ZIP Code" onChange={handleInputChange} />
            <input type="text" name="country" placeholder="Country" onChange={handleInputChange} />
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
            <input type="button" value="Place Order" id="placeOrderButton" onClick={handleOrder} />
          </div>
        </>
        )}
      </div>
    </article>
  );
};

export default Webstore;

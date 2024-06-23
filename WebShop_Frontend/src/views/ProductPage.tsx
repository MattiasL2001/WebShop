import React, {useState} from 'react';
import '../styles/product.scss';
import { Product } from '../components/models/Product';
import { useLocation } from 'react-router-dom';
import one from "../images/products/1.png"
import two from "../images/products/2.png"
import three from "../images/products/3.png"
import four from "../images/products/4.png"

const ProductPage: React.FC = () => {

  const [image,setImage] = useState("")

  const stateData = useLocation().state

  let product: Product | undefined = undefined 
  
  if (stateData) { 

    product = stateData as Product

  }

  if (image === "") {

  switch (product?.image) {
    case "1":
      setImage(one)
      break
    case "2":
      setImage(two)
      break
    case "3":
      setImage(three)
      break
    case "4":
      setImage(four)
      break
  }
}

  return (
      <>
        <article className="product-page">
          <div className="product-image">
            <img src={image} alt="Product image" />
          </div>
          <div className="separator"></div>
          <div className="product-details">
            <h1>{product?.name}</h1>
            <p>Price: {product?.price}</p>
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </article>
        <article className="product-description">
          <p>Product Description</p>
        </article>
      </>
  );
};

export default ProductPage;

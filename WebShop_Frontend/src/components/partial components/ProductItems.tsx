import React from 'react';
import { Product } from '../models/Product';
import { Link } from 'react-router-dom';

const ProductItems: React.FC<{products: Product[]}> = ({products}) => {

return (

<section id="articles">
      <p>Products Test!!!!!!!!!!!!!!!</p>
        {products.map((product: Product) => (
          <Link to={`/products/${product.id}`} key={product.id} state={product} className="product">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
          </Link>
      ))}
      </section>

    )}

export default ProductItems
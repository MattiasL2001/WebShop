import React from "react"; 
import { GetProducts } from "../../services/webShopServices";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const ProductItems: React.FC = () => {

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: GetProducts,
  });

  return (
     <section id="articles">
        {products?.map((product: any) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </Link>
    ))}
  </section>
  );
};
 
export default ProductItems
import React, { useState } from 'react';
import { GetProducts } from '../../services/webShopServices';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PaginationControl from '../PaginationControl';
import { Product } from '../models/Product';
import defaultImage from "../../images/1.png";

const ProductItems: React.FC = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: GetProducts,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section>
      <div id="articles">
        {currentItems.map((product: Product) => (
          <Link to={`/product/${product.Id}`} key={product.Id} className="product" style={{ display: 'block', marginBottom: '20px' }}>
            <div className="image-container">
              <img
                src={product.Image || defaultImage}
                alt={product.Name}
              />
            </div>
            <h2>Product Name With A Very Long Name :O {product.Name}</h2>
            <p>Price: ${product.Price}</p>
          </Link>
        ))}
      </div>
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
    </section>
  );
};

export default ProductItems;

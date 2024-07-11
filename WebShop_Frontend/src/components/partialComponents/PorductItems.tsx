import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PaginationControl from '../PaginationControl';
import { Product } from '../models/Product';
import defaultImage from "../../images/products/1.png";

const ProductItems: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxNameLength = 20;

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

  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  return (
    <section>
      <div id="articles">
        {currentItems.map((product: Product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product" state={product} style={{ display: 'block', marginBottom: '20px' }}>
            <div className="image-container">
              <img
                src={product.image || defaultImage}
                alt={product.name}
              />
            </div>
            <div className='name-container'>
              <h2>{truncateName(product.name, maxNameLength)}</h2> {/* Adjust the maxLength as needed */}
            </div>
            <p>Price: ${product.price}</p>
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

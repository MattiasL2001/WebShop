import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PaginationControl from '../PaginationControl';
import { Product } from '../models/Product';
import { getProductImage } from '../getProductImage';
import { GetFilteredProductCount } from '../../services/webShopServices';
import { PageProps } from '../models/props/pageProps';

interface ProductItemsProps {
  products: Product[];
  pageProps: PageProps;
  filters: {
    type?: number;
    color?: number;
    gender?: number;
    search?: string;
  };
}

const ProductItems: React.FC<ProductItemsProps> = ({
  products,
  pageProps: { page, numberPerPage, setPage },
  filters: { type, color, gender, search }
}) => {
const { data: numberOfProducts = 0 } = useQuery<number>({
  queryKey: ['filteredProductCount', type, color, gender, search],
  queryFn: () => GetFilteredProductCount(type, color, gender, search),
});

const image = getProductImage

const totalPages = Math.ceil(numberOfProducts / numberPerPage);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const truncateName = (name: string, maxLength: number) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }
    return name;
  };

  return (
    <section>
      <div id="articles">
        {products.map((product: Product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product" state={product}>
            <div className="image-container">
              <img
                src={image(product.image)}
                alt={product.name}
              />
            </div>
            <div className='name-container'>
              <h2>{truncateName(product.name, 20)}</h2>
            </div>
            <p>Price: ${product.price}</p>
          </Link>
        ))}
      </div>
      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
    </section>
  );
};

export default ProductItems;

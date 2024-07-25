import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PaginationControl from '../PaginationControl';
import { Product } from '../models/Product';
import defaultImage from "../../images/products/1.png";
import { GetNumberOfProducts, GetProducts } from '../../services/webShopServices';
import { PageProps } from '../models/props/pageProps';

interface ProductItemsProps {
  products: Product[];
  pageProps: PageProps;
  filters: {
    gender?: number;
    productProperty?: number;
    color?: number;
    sortBy?: string;
    search?: string;
  };
}

const ProductItems: React.FC<ProductItemsProps> = ({ products, pageProps: { page, numberPerPage, setPage }, filters }) => {
  const { data: numberOfProducts = 0 } = useQuery<number>({
    queryKey: ['numberOfProducts'],
    queryFn: GetNumberOfProducts,
  });

  const { data: getProducts = [] } = useQuery<Product[]>({
    queryKey: ['getProducts', page, numberPerPage, filters],
    queryFn: () => GetProducts(numberPerPage, page, filters.productProperty, filters.color, filters.gender, filters.sortBy, filters.search),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await GetProducts(15, 1, undefined, undefined, undefined, undefined, "intelligent");
        console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
        {getProducts.map((product: Product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product" state={product}>
            <div className="image-container">
              <img
                src={product.image || defaultImage}
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

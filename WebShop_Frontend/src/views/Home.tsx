import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Page from '../components/Page';
import { GetProducts } from '../services/webShopServices';
import { Link } from 'react-router-dom';
import { Filter } from '../components/models/Filter';
import '../styles/styles.css';
import '../styles/home.scss';
import SelectFilter from '../components/partial components/SelectFilter';


const Webstore: React.FC = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: GetProducts,
  });

  return (
    <Page>
      <div id="searchArticles">
        
      <SelectFilter filterItems={Filter.Gender}></SelectFilter>

      <SelectFilter filterItems={Filter.ProductProperty}></SelectFilter>

      <SelectFilter filterItems={Filter.Colors}></SelectFilter>

      <SelectFilter filterItems={Filter.Sort}></SelectFilter>

      </div>
      
      <section id="articles">
        {products?.map((product: any) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </Link>
    ))}
  </section>
    </Page>
  );
};

export default Webstore;

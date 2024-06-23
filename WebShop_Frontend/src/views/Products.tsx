import React from 'react';
import Page from '../components/Page';
import { Filter } from '../components/models/Filter';
import '../styles/styles.css';
import '../styles/home.scss';
import SelectFilter from '../components/partial components/SelectFilter';
import ProductItems from '../components/partial components/ProductItems';
import { Product } from '../components/models/Product';
import { Outlet } from 'react-router-dom';

const Products: React.FC<{products: Product[]}> = ({products}) => {

  return (
    <>
      <div id="searchArticles">
        
      <SelectFilter filterItems={Filter.Gender}/>

      <SelectFilter filterItems={Filter.ProductProperty}/>

      <SelectFilter filterItems={Filter.Colors}/>

      <SelectFilter filterItems={Filter.Sort}/>

      </div>

      <ProductItems products={products}/>
    </>
  );
};

export default Products;

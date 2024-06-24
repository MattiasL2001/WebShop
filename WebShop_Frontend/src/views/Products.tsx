import React from 'react';
import { Filter } from '../components/models/Filter';
import '../styles/styles.css';
import '../styles/home.scss';
import SelectFilter from '../components/partialComponents/SelectFilter';
import ProductItems from '../components/partialComponents/PorductItems';
import { Product } from '../components/models/Product';

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

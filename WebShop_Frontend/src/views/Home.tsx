import React from 'react';
import Page from '../components/Page';
import { Filter } from '../components/models/Filter';
import '../styles/styles.css';
import '../styles/home.scss';
import SelectFilter from '../components/partial components/SelectFilter';
import ProductItems from '../components/partial components/PorductItems';

const Webstore: React.FC = () => {

  return (
    <Page>
      <div id="searchArticles">
        
      <SelectFilter filterItems={Filter.Gender}/>

      <SelectFilter filterItems={Filter.ProductProperty}/>

      <SelectFilter filterItems={Filter.Colors}/>

      <SelectFilter filterItems={Filter.Sort}/>

      </div>

      <ProductItems/>

    </Page>
  );
};

export default Webstore;

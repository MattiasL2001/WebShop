import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Page from '../components/Page';
import { GetProducts } from '../services/webShopServices';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Webstore: React.FC = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: GetProducts,
  });

  return (
    <Page>
      <div id="searchArticles">
        <select name="gender" className="filter" id="filterGender">
          <option value="gender">Filter By Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

        <select name="product" className="filter">
          <option value="">Filter By Product</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>

        <select name="color" className="filter">
          <option value="">Filter By Color</option>
          <option value="white">White</option>
          <option value="gray">Gray</option>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="blue">Blue</option>
          <option value="pink">Pink</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
        </select>

        <select name="sort" className="filter">
          <option value="">SORT BY</option>
          <option value="price-low">Price, lowest first</option>
          <option value="price-high">Price, highest first</option>
          <option value="name">Name</option>
        </select>
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

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/styles.css';

const Webstore: React.FC = () => {

  return (
    <>
      <Header></Header>

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

      <section id="articles"></section>

      <Footer></Footer>
    </>
  );
};

export default Webstore;

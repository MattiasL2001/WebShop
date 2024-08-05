import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SelectFilter from '../components/partialComponents/SelectFilter';
import ProductItems from '../components/partialComponents/ProductItems';
import { Product } from '../components/models/Product';
import { Filter } from '../components/models/Filter';
import { GetProducts } from '../services/webShopServices';
import '../styles/styles.css';
import '../styles/home.scss';

const GenderMapping: { [key: string]: number } = {
  "Men": 0,
  "Women": 1
};

const ColorsMapping: { [key: string]: number } = {
  "White": 0,
  "Gray": 1,
  "Black": 2,
  "Red": 3,
  "Green": 4,
  "Yellow": 5,
  "Orange": 6,
  "Blue": 7,
  "Pink": 8,
  "Purple": 9,
  "Brown": 10
};

const ProductPropertyMapping: { [key: string]: number } = {
  "Clothing": 0,
  "Accessories": 1
};

const SortMapping: { [key: string]: string } = {
  "Price, lowest first": "price-lowest-first",
  "Price, highest first": "price-highest-first"
};

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const genderFilter = searchParams.get('gender') ? Number(searchParams.get('gender')) : undefined;
  const productTypeFilter = searchParams.get('productType') ? Number(searchParams.get('productType')) : undefined;
  const colorFilter = searchParams.get('color') ? Number(searchParams.get('color')) : undefined;
  const sortFilter = searchParams.get('sortBy') || undefined;
  const searchFilter = searchParams.get('search') || "";
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const numberPerPage = searchParams.get('numberPerPage') ? Number(searchParams.get('numberPerPage')) : 24;

  const updateSearchParams = useCallback(() => {
    setSearchParams({
      gender: genderFilter !== undefined ? genderFilter.toString() : '',
      color: colorFilter !== undefined ? colorFilter.toString() : '',
      productType: productTypeFilter !== undefined ? productTypeFilter.toString() : '',
      sortBy: sortFilter || '',
      search: searchFilter || '',
      page: page.toString(),
      numberPerPage: numberPerPage.toString()
    });
  }, [genderFilter, colorFilter, productTypeFilter, sortFilter, searchFilter, page, numberPerPage, setSearchParams]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  const handleFilterChange = useCallback((mapping: { [key: string]: number | undefined }, paramName: string, value: string) => {
    const mappedValue = mapping[value];
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (typeof mappedValue === 'number') {
        newParams.set(paramName, mappedValue.toString());
      } else {
        newParams.delete(paramName);
      }
      return newParams;
    });
  }, [setSearchParams]);

  const handleGenderChange = (value: string) => handleFilterChange(GenderMapping, 'gender', value);
  const handleProductPropertyChange = (value: string) => handleFilterChange(ProductPropertyMapping, 'productType', value);
  const handleColorChange = (value: string) => handleFilterChange(ColorsMapping, 'color', value);
  const handleSortChange = (value: string) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('sortBy', SortMapping[value] || '');
      return newParams;
    });
  };

  const { data: filteredProducts = [] } = useQuery<Product[]>({
    queryKey: ['getProducts', page, numberPerPage, genderFilter, productTypeFilter, colorFilter, sortFilter, searchFilter],
    queryFn: () => GetProducts(numberPerPage, page, productTypeFilter, colorFilter, genderFilter, sortFilter, searchFilter)
  });

  return (
    <>
      <div id="searchArticles">
        <SelectFilter filterItems={Filter.Gender} onChange={handleGenderChange} />
        <SelectFilter filterItems={Filter.ProductProperty} onChange={handleProductPropertyChange} />
        <SelectFilter filterItems={Filter.Colors} onChange={handleColorChange} />
        <SelectFilter filterItems={Filter.Sort} onChange={handleSortChange} />
      </div>

      <ProductItems 
        products={filteredProducts} 
        pageProps={{ page, numberPerPage, setPage: (newPage) => setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          newParams.set('page', newPage.toString());
          return newParams;
        }) }}
      />
    </>
  );
};

export default Products;

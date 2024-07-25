import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SelectFilter from '../components/partialComponents/SelectFilter';
import ProductItems from '../components/partialComponents/ProductItems';
import { Product } from '../components/models/Product';
import { PageProps } from "../components/models/props/pageProps";
import { Filter } from '../components/models/Filter';
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

const Products: React.FC<{ products: Product[], pageProps: PageProps }> = ({ products, pageProps }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genderFilter, setGenderFilter] = useState<number | undefined>(undefined);
  const [productPropertyFilter, setProductPropertyFilter] = useState<number | undefined>(undefined);
  const [colorFilter, setColorFilter] = useState<number | undefined>(undefined);
  const [sortFilter, setSortFilter] = useState<string | undefined>(undefined);
  const [searchFilter, setSearchFilter] = useState<string | undefined>(undefined);

  const [page, setPage] = useState<number>(1);
  const [numberPerPage, setNumberPerPage] = useState<number>(24);

  useEffect(() => {
    const gender = searchParams.get('gender');
    const color = searchParams.get('color');
    const productType = searchParams.get('productType');
    const sortBy = searchParams.get('sortBy');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const numberPerPage = searchParams.get('numberPerPage');

    if (gender) {
      setGenderFilter(parseInt(gender));
    }
    if (color) {
      setColorFilter(parseInt(color));
    }
    if (productType) {
      setProductPropertyFilter(parseInt(productType));
    }
    if (sortBy) {
      setSortFilter(sortBy);
    }
    if (search) {
      setSearchFilter(search);
    }
    else {setSearchFilter("")}
    if (page) {
      setPage(parseInt(page));
    }
    if (numberPerPage) {
      setNumberPerPage(parseInt(numberPerPage));
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({
      gender: genderFilter !== undefined ? genderFilter.toString() : '',
      color: colorFilter !== undefined ? colorFilter.toString() : '',
      productType: productPropertyFilter !== undefined ? productPropertyFilter.toString() : '',
      sortBy: sortFilter || '',
      search: searchFilter || '',
      page: page.toString(),
      numberPerPage: numberPerPage.toString()
    });
  }, [genderFilter, colorFilter, productPropertyFilter, sortFilter, searchFilter, page, numberPerPage]);

  const handleFilterChange = (
    mapping: { [key: string]: number | undefined },
    setFilter: React.Dispatch<React.SetStateAction<number | undefined>>,
    value: string
  ) => {
    const mappedValue = mapping[value];
    if (typeof mappedValue === 'number') {
      setFilter(mappedValue);
    } else {
      setFilter(undefined);
    }
  };

  const handleGenderChange = (value: string) => {
    handleFilterChange(GenderMapping, setGenderFilter, value);
  };

  const handleProductPropertyChange = (value: string) => {
    handleFilterChange(ProductPropertyMapping, setProductPropertyFilter, value);
  };

  const handleColorChange = (value: string) => {
    handleFilterChange(ColorsMapping, setColorFilter, value);
  };

  const handleSortChange = (value: string) => {
    if (SortMapping[value]) {
      setSortFilter(SortMapping[value]);
    } else {
      setSortFilter(undefined);
    }
  };

  return (
    <>
      <div id="searchArticles">
        <SelectFilter filterItems={Filter.Gender} onChange={handleGenderChange} />
        <SelectFilter filterItems={Filter.ProductProperty} onChange={handleProductPropertyChange} />
        <SelectFilter filterItems={Filter.Colors} onChange={handleColorChange} />
        <SelectFilter filterItems={Filter.Sort} onChange={handleSortChange} />
      </div>

      <ProductItems 
        products={products} 
        pageProps={{ page, numberPerPage, setPage }}
        filters={{
          gender: genderFilter,
          productProperty: productPropertyFilter,
          color: colorFilter,
          sortBy: sortFilter,
          search: searchFilter
        }}
      />
    </>
  );
};

export default Products;

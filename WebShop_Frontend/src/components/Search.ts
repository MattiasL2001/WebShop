import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSearch = (initialValue: string = '') => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate(`/products?gender=&color=&productType=&sortBy=&search=${searchTerm.trim().toString()}&page=1&numberPerPage=24`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return {
    searchTerm,
    handleSearchChange,
    handleKeyDown,
    handleSearchClick
  };
};

export default useSearch;

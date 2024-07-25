import React from 'react';

interface SelectFilterProps {
  filterItems: string[];
  onChange: (value: string) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ filterItems, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  return (
    <select className='filter' onChange={handleChange}>
      {filterItems.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;

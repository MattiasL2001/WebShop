import React from 'react';

const SelectFilter: React.FC<{filterItems: string[]}> = (filter) => {

return (
<select name="gender" className="filter" id="filterGender">
    {filter.filterItems.map((item) => (
        <option key={filter.filterItems.indexOf(item)} value={item.toLowerCase().replaceAll(" ","-").replaceAll(",","")}>{item}</option>)
    )}
</select>
)

}

export default SelectFilter
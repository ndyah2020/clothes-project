import React from 'react';
import { Input } from 'antd';


const { Search } = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);
const SearchComponen = () => {
  return (
    <div>
      <Search 
      placeholder="input search text" 
      onSearch={onSearch} 
      style={{ 
        width: 400, 
        marginLeft: 400,
      }} />
    </div>
  )
}

export default SearchComponen
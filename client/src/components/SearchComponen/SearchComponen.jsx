import React from 'react';
import { Input } from 'antd';


const { Search } = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);
const SearchComponen = () => {
  return (
    <div>
      <Search 
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
    </div>
  )
}

export default SearchComponen
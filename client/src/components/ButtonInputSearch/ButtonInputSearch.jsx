
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchContainer } from './style';

const { Search } = Input;

const ButtonInputSearch = (props) => {
    const{ size, placeholder} = props
  return (
    <SearchContainer>
      <Search
        size={size}
        placeholder={placeholder}
        enterButton={<SearchOutlined />}
      />
    </SearchContainer>
  );
};

export default ButtonInputSearch;

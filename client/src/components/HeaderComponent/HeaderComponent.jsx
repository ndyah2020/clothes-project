// HeaderComponent.jsx
import React from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined,} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import {
  HeaderContainer,
  Logo,
  Navigation,
  NavLink,
  Actions,
  Icon,
} from './style';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';

const HeaderComponent = () => {

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
      <HeaderContainer>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo  onClick={handleLogoClick}>Clothify</Logo>
        </Link>
        <Navigation>
          <Link to="/category/show">
            <NavLink>Danh Mục</NavLink>
          </Link>
          <Link to="/contract">
            <NavLink>Liên Hệ</NavLink>
          </Link>
        </Navigation>
        <ButtonInputSearch 
          size = 'large'
          placeholder= "Bạn cần gì..."
        /> 

        <Actions>
          <Badge count={5}>
            <Icon as={ShoppingCartOutlined} />
          </Badge>
          <Link>
            <Icon as={UserOutlined} />
          </Link>
        </Actions>
      </HeaderContainer>
  );
};

export default HeaderComponent;

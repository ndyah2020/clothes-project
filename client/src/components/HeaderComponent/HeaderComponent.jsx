// HeaderComponent.jsx
import React from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined,} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import SearchComponen from '../SearchComponen/SearchComponen';
import {
  HeaderContainer,
  Logo,
  Navigation,
  NavLink,
  Actions,
  Icon,
} from './style';

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
            <NavLink>DANH MỤC</NavLink>
          </Link>
          <Link to="/contract">
            <NavLink>LIÊN HỆ</NavLink>
          </Link>
          <SearchComponen></SearchComponen>
        </Navigation>

        <Actions>
          <Badge count={5}>
            <Icon as={ShoppingCartOutlined} />
          </Badge>
          <Link to='/Signin'>
            <Icon as={UserOutlined} />
          </Link>
        </Actions>
      </HeaderContainer>
  );
};

export default HeaderComponent;

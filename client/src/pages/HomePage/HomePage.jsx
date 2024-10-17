// HomePage.jsx
import React from 'react';

import {
  HomeContainer,
  ContentSection,
  MainHeading,
} from './style'; 

import LayoutComponen from '../../components/LayoutComponent/LayoutComponent';
import BannerComponent from '../../components/BannerComponent/BannerComponent';
import ProductComponent from '../../components/ProductComponent/ProductComponent';


const HomePage = () => {
  return (
    <HomeContainer>
      {/* Phần banner */}
        <BannerComponent/>
      {/* Phần giới thiệu */}
      <LayoutComponen>
        <ContentSection>
          <MainHeading>Sản Phẩm Clothify</MainHeading>
        </ContentSection>  

        <ProductComponent/>  
      </LayoutComponen>
      {/* footer */}      
    </HomeContainer>
  );
};

export default HomePage;

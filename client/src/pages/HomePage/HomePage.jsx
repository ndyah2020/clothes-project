// HomePage.jsx
import React from 'react';

import {
  HomeContainer,
  ContentSection,
  MainHeading,
} from './style'; 

import LayoutComponen from '../../components/LayoutComponent/LayoutComponent';
import BannerComponent from '../../components/BannerComponent/BannerComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';

const HomePage = () => {
  return (
    <HomeContainer>
      {/* Phần banner */}
        <BannerComponent/>
      {/* Phần giới thiệu */}
      <LayoutComponen>
        <ContentSection>
          <MainHeading>Danh Mục Sản Phẩm Clothify</MainHeading>
        </ContentSection>    
      </LayoutComponen>
      {/* footer */}      
    </HomeContainer>
  );
};

export default HomePage;

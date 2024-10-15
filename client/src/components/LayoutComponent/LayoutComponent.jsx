// Layout.jsx
import React from 'react';
import { LayoutContainer } from './style'; 

const LayoutComponent = ({ children }) => {
  return (
    <LayoutContainer>
      {children}
    </LayoutContainer>
  );
};

export default LayoutComponent;

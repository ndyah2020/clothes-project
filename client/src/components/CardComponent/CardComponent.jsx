import React from 'react';
import {
    ProductCardWrapper,
    ProductImage,
    ProductName,
    ProductPrice,
} from './style'; 

const CardComponen = ({ product }) => {
    return (
        <ProductCardWrapper>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price}</ProductPrice>
        </ProductCardWrapper>
    );
};

export default CardComponen;

import styled from 'styled-components';

export const ProductCardWrapper = styled.div`
    width: 200px;
    padding: 25px;
    margin: 8px 0;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.5s ease;
    &:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        transform: scale(1.05); 
    }
`;
export const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

export const ProductName = styled.h3`
  font-size: 1.2em;
  margin: 15px 0 10px;
`;

export const ProductPrice = styled.p`
  font-size: 1em;
  color: #666;
`
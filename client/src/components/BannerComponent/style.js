import styled from 'styled-components';

export const CarouselContainer = styled.div`
  max-width: 100%;
  margin-bottom: 50px;
  .carousel-item img {
    width: 100%;
    height: 900px;
    object-fit: cover;
    object-position: center; 
    transition: transform 0.5s ease-in-out;
  }
`;
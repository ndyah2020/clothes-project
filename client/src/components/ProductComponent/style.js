import styled from 'styled-components';

// Styled Components
export const Container = styled.div`
    text-align: center;
    margin: 100px 0;

`;

export const ButtonGroup = styled.div`
    margin-bottom: 30px;
`;

export const FilterButton = styled.button`
    margin: 0 10px;
    padding: 10px 20px;
    color: #777777; 
    letter-spacing: 1px;
    font-family: 'Didot', serif;
    font-size: 20px;
    border: none;
    background-color: ${(props) => (props.$active ? '#EEEEEE' : '#FFFFFF')};
    color: ${(props) => (props.active ? '#fff' : '#000')};
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: ${(props) => (props.$active ? '#ccc' : '#ccc')};
    }
`;

export const ProductList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`;


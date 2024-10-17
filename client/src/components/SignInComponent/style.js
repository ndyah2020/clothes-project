import styled from 'styled-components';

// Full page container
export const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: space-between;
`;

// Left section for the title
export const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #fff;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #777777;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #777777;
    margin-top: 10px;
  }
`;

// Right section for the form
export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  padding: 0 80px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Input = styled.input`
  padding: 15px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

export const Button = styled.button`
  padding: 15px;
  font-size: 16px;
  border: none;
  background-color: #777777;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const StyledLink = styled.a`
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

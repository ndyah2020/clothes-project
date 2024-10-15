// style.js
import styled from 'styled-components';
import { Button } from 'antd';


export const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1; 
  top: 0;
  left: 0;
  right: 0; 
`;

export const Logo = styled.h1`
    font-size: 30px;
    font-weight: bold;
    color: #1890ff;
    font-family: 'Lobster', cursive; /* Sử dụng font chữ đặc biệt từ Google Fonts */
    margin: 0;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
        color: #40a9ff;
        transform: scale(1.05); 
  }
`;
export const Navigation = styled.div`
  display: flex;
  gap: 50px;
`;


export const NavLink = styled(Button)`
  font-size: 16px; 
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-family: 'Poppins', sans-serif; 
  font-weight: 500; 
  letter-spacing: 1px; 
  transition: color 0.3s ease-in-out, transform 0.2s ease; 
  &:hover {
    color: #1890ff;
    transform: scale(1.05);
  }
`;


export const Actions = styled.div`
  display: flex;
  gap: 15px;
  margin-right: 20px
`;

export const Icon = styled.span`
  font-size: 24px;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #1890ff;
  }
`;




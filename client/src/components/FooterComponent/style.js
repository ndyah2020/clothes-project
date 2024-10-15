import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #eaeaea;
  margin-top: 50px;
  margin-bottom: 0;
`;

export const FooterSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const FooterTitle = styled.h3`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const FooterLink = styled.div`
  margin-bottom: 10px;
  
  a {
    color: #555;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
`;

export const FooterCopyright = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #888;
  text-align: center;
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

export const SocialIcon = styled.span`
  font-size: 24px;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #1890ff;
  }
`;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FooterContainer,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterCopyright,
  SocialIcons,
  SocialIcon
} from './style';  // Import các styled components

import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';  // Import icon mạng xã hội từ Ant Design

const FooterComponent = () => {
  return (
    <FooterContainer>
      <FooterSection>
        <FooterTitle>Liên Kết Nhanh</FooterTitle>
        <FooterLink>
          <Link to="/">Trang Chủ</Link>
        </FooterLink>
        <FooterLink>
          <Link to="/products">Sản Phẩm</Link>
        </FooterLink>
        <FooterLink>
          <Link to="/about">Thông Tin</Link>
        </FooterLink>
        <FooterLink>
          <Link to="/contact">Liên Hệ</Link>
        </FooterLink>
      </FooterSection>

      <FooterSection>
        <FooterTitle>Thông Tin Liên Hệ</FooterTitle>
        <p>Địa chỉ: 123 Đường ABC, Thành Phố XYZ</p>
        <p>Email: support@clothify.com</p>
        <p>Điện thoại: 0123 456 789</p>
      </FooterSection>

      <FooterSection>
        <FooterTitle>Theo Dõi Chúng Tôi</FooterTitle>
        <SocialIcons>
          <SocialIcon as={FacebookOutlined} />
          <SocialIcon as={InstagramOutlined} />
          <SocialIcon as={TwitterOutlined} />
        </SocialIcons>
      </FooterSection>

      <FooterCopyright>
        © {new Date().getFullYear()} Clothify. All rights reserved.
      </FooterCopyright>
    </FooterContainer>
  );
};

export default FooterComponent;

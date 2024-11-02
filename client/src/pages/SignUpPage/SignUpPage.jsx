import React, { useState } from 'react';
import axios from 'axios';
import {
  PageContainer,
  LeftSection,
  RightSection,
  Title,
  Input,
  Button,
  Form,
  LinkContainer,
  StyledLink,
} from './style';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      console.log("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Gọi API đăng ký
      const response = await axios.post('http://localhost:3000/user/register', {
        email,
        firstName,
        lastName,
        password,
      });

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        console.log("Đăng ký thành công:", response.data);
        alert("Đăng ký thành công!"); // Thông báo thành công
        window.location.href = '/Signin'; // Chuyển hướng đến trang đăng nhập
      }
    } catch (error) {
      // Xử lý lỗi từ server
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Đăng ký thất bại. Vui lòng thử lại.";
      console.error("Đăng ký thất bại:", errorMsg);
      alert(errorMsg); // Hiển thị thông báo lỗi
    }
  };

  return (
    <PageContainer>
      <LeftSection>
        <Title>Đăng Ký</Title>
      </LeftSection>
      <RightSection>
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="text"
          
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Họ"
            required
          />
          <Input
            type="text"
           
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Tên"
            required
          />
          <Input
            type="password"
           
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
          <Input
            type="password"
          
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Nhập lại mật khẩu"
            required
          />
          <Button type="submit">Đăng Ký</Button>
        </Form>
        <LinkContainer>
          <StyledLink href="/Signin">Đăng Nhập</StyledLink>
        </LinkContainer>
      </RightSection>
    </PageContainer>
  );
};

export default SignUpPage;

import React, { useState } from 'react';
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

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignIn = async (values) => {
    const { email, password, firstName, lastName } = values;
    try {
      const response = isEditMode
         await fetch("http://localhost:3001/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
            }),
          });
      if (response.ok) {
        message.success(
          `User ${isEditMode ? "updated" : "created"} successfully!`
        );
        fetchData(); // Fetch lại danh sách người dùng sau khi tạo mới hoặc cập nhật thành công
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save user."}`);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Failed to save user.");
    }
  };

  return (
    <PageContainer>
      <LeftSection>
        <Title>Đăng nhập</Title>
      </LeftSection>
      <RightSection>
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
          <Button type="submit">Đăng nhập</Button>
        </Form>
        <LinkContainer>
          <StyledLink href="#">Quên mật khẩu?</StyledLink>
          <StyledLink href="/Signup">Đăng ký</StyledLink>
        </LinkContainer>
      </RightSection>
    </PageContainer>
  );
};

export default SignInPage;

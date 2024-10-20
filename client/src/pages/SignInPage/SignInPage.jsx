import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        })
      })
      const data = await response.json()
      if(data.success) {
        const token = await data.token
        localStorage.setItem('jsonwebtoken', token)
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }  
  }

  return (
    <PageContainer>
      <LeftSection>
        <Title>Đăng nhập</Title>
      </LeftSection>
      <RightSection>
        <Form onSubmit={handleSignIn}>
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
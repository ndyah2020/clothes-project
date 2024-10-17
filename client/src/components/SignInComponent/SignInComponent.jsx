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

const SignInComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
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
          <StyledLink href="#">Đăng ký</StyledLink>
        </LinkContainer>
      </RightSection>
    </PageContainer>
  );
};

export default SignInComponent;

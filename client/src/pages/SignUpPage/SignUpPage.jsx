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

const SignUpPage = () => {
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
        <Title>Đăng Ký</Title>
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
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Họ"
            required
          />
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tên"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

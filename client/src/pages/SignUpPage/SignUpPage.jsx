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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
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

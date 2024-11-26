import React, { Component } from "react";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  message,
} from "antd";
import jwt from "jsonwebtoken";
import axios from "axios";
import signinbg from "../assets/images/img-signin.jpg";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Footer, Content } = Layout;

export default class SignIn extends Component {
  render() {

    const onFinish = async (values) => {
      try {
        const response = await axios.post("http://localhost:3001/user/login", {
          email: values.email,
          password: values.password,
        });

        // Xử lý đăng nhập thành công
        if (response.status === 200) {
          const { token } = response.data;
          const decoded = jwt.decode(token);
          if(decoded.status === 'block'){
            message.status("User Blocked")
            return;
          }
    
          localStorage.setItem("token", token);
          message.success("Login successful!");
          window.location.href = "/dashboard";
        }
      } catch (error) {
        // Xử lý lỗi đăng nhập
        const errorMsg =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Login failed. Please try again.";
        message.error(errorMsg);
      }
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
      message.error("Please check the form fields and try again.");
    };

    return (
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email and password to sign in
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Password"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  {/* Thay Link bằng thẻ a */}
                  <a href="/forgot-password" className="text-dark font-bold">
                    Forgot Password?
                  </a>
                </p>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={signinbg} alt="" />
            </Col>
          </Row>
        </Content>
        <Footer>
          <Menu mode="horizontal">
            <Menu.Item>Company</Menu.Item>
            <Menu.Item>About Us</Menu.Item>
            <Menu.Item>Teams</Menu.Item>
            <Menu.Item>Products</Menu.Item>
            <Menu.Item>Blogs</Menu.Item>
            <Menu.Item>Pricing</Menu.Item>
          </Menu>
          <p className="copyright">
            Copyright © 2024 Muse by <a href="#pablo">Creative Tim</a>.
          </p>
        </Footer>
      </Layout>
    );
  }
}

import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const history = useHistory();

  // Lấy token từ query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onFinish = async (values) => {
    try {
      await axios.post("http://localhost:3001/user/reset-password", {
        token, // Gửi token từ URL
        password: values.password,
      });

      message.success("Password has been reset successfully!");
      history.push("/sign-in"); // Chuyển về trang đăng nhập sau khi thành công
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to reset password.";
      message.error(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Reset Password</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your new password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm New Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;

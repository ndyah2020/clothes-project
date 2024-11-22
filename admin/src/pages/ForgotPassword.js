import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const history = useHistory();
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP
  const [email, setEmail] = useState(""); // Lưu email để dùng lại ở bước nhập OTP

  // Xử lý khi gửi email
  const onFinishEmail = async (values) => {
    try {
      await axios.post("http://localhost:3001/user/verify-email", {
        email: values.email,
      });
      message.success("OTP has been sent to your email!");
      setEmail(values.email); // Lưu email đã nhập
      setStep(2); // Chuyển sang bước nhập OTP
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Email not found or request failed.";
      message.error(errorMsg);
    }
  };

  // Xử lý khi gửi OTP
  const onFinishOTP = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/user/verify-otp",
        {
          email,
          otp: values.otp,
        }
      );

      if (response.status === 200) {
        message.success("OTP verified successfully!");
        const token = response.data.token; // Lấy token từ API
        history.push(`/reset-password?token=${token}`); // Điều hướng sang trang Reset Password
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      message.error(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <Form onFinish={onFinishEmail}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Enter OTP</h2>
          <p>We sent a 6-digit OTP to your email: {email}</p>
          <Form onFinish={onFinishOTP}>
            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Please input the OTP!",
                },
                {
                  len: 6,
                  message: "OTP must be 6 digits!",
                },
              ]}
            >
              <Input placeholder="Enter OTP" maxLength={6} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;

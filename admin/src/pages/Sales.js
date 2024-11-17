import React, { useState } from "react";
import { Layout, Card, Row, Col, Button, List, Divider, Empty } from "antd";

const { Header, Content, Sider } = Layout;

const products = [
  { id: 1, name: "Crispy Dory Sambal Matah", price: 101.0, available: 12 },
  { id: 2, name: "Kopag Benedict", price: 75.0, available: 32 },
  { id: 3, name: "Holland Bitterballen", price: 50.5, available: 12 },
  { id: 4, name: "Dory En Oats", price: 75.0, available: 32 },
  { id: 5, name: "Lemon Butter Dory", price: 101.0, available: 0 },
  { id: 6, name: "Spicy Tuna Nachos", price: 75.0, available: 32 },
];

const Sales = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const calculateTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#1890ff",
          color: "#fff",
          textAlign: "center",
          padding: "0",
        }}
      >
        <h2 style={{ color: "#fff", margin: "0" }}>Sales Interface</h2>
      </Header>
      <Layout style={{ display: "flex", padding: "20px" }}>
        <Sider
          width={300}
          style={{ backgroundColor: "#f0f2f5", padding: "20px" }}
        >
          <h3 style={{ marginBottom: "16px" }}>Menu</h3>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col span={24} key={product.id}>
                <Card
                  title={product.name}
                  extra={<span>${product.price.toFixed(2)}</span>}
                  style={{
                    marginBottom: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => addToCart(product)}
                      style={{ width: "100%", borderRadius: "8px" }}
                    >
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <p>{product.available} Available</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Sider>
        <Content style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
          <h3 style={{ marginBottom: "16px" }}>Order Details</h3>
          {cart.length > 0 ? (
            <List
              bordered
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                  </span>
                  <Button
                    type="link"
                    danger
                    onClick={() =>
                      setCart(
                        cart.filter((cartItem) => cartItem.id !== item.id)
                      )
                    }
                  >
                    Remove
                  </Button>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No items in cart" />
          )}
          <Divider />
          <div style={{ textAlign: "right", fontSize: "16px" }}>
            <p>Subtotal: ${calculateTotal().toFixed(2)}</p>
            <p>Tax (10%): ${(calculateTotal() * 0.1).toFixed(2)}</p>
            <h3>Total: ${(calculateTotal() * 1.1).toFixed(2)}</h3>
            <Button
              type="primary"
              size="large"
              style={{ marginTop: "10px", width: "100%", borderRadius: "8px" }}
            >
              Process Transaction
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sales;

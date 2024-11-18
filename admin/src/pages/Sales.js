import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  List,
  Divider,
  Card,
  Select,
  message,
  InputNumber,
} from "antd";
import axios from "axios";

const { Option } = Select;

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderType, setOrderType] = useState("shop"); // Default is "Mua tại shop"
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  // Fetch product list
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/product/get-products"
      );
      const productsWithImages = response.data.map((product) => {
        if (product.images && product.images.length > 0) {
          const imageBase64 = product.images[0].data;
          const contentType = product.images[0].contentType;
          product.image = `data:${contentType};base64,${imageBase64}`;
        }
        product.selectedSizeIndex = 0; // Default to the first size in the list
        return product;
      });
      setProducts(productsWithImages);
      setFilteredProducts(productsWithImages);
    } catch (error) {
      message.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const selectedSize = product.sizes[product.selectedSizeIndex];
    const cartItemKey = `${product.id}-${selectedSize.size}-${product.name}`;

    const existingProduct = cart.find(
      (item) => item.cartItemKey === cartItemKey
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.cartItemKey === cartItemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, selectedSize, cartItemKey },
      ]);
    }
  };

  // Remove product from cart
  const removeFromCart = (cartItemKey) => {
    setCart(cart.filter((item) => item.cartItemKey !== cartItemKey));
  };

  // Update product quantity in cart
  const updateQuantity = (cartItemKey, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.cartItemKey === cartItemKey
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Calculate total price
  const calculateTotal = () =>
    cart.reduce(
      (total, item) => total + (item.selectedSize.price || 0) * item.quantity,
      0
    );

  // Apply discount based on promo code
  const applyDiscount = () => {
    if (promoCode === "DISCOUNT10") {
      setDiscount(calculateTotal() * 0.1); // 10% discount
    } else if (promoCode === "SAVE50") {
      setDiscount(50); // 50 VNĐ discount
    } else {
      message.error("Invalid promo code");
      setDiscount(0);
    }
  };

  // Check customer by phone number
  const checkCustomer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/customer/get-customer?phone=${customerPhone}`
      );
      if (response.data) {
        setCustomerName(response.data.name);
      } else {
        message.info("Customer not found");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  // Update shipping fee based on order type and address
  useEffect(() => {
    if (orderType === "online") {
      if (shippingAddress.toLowerCase().includes("tphcm")) {
        setShippingFee(20000);
      } else if (shippingAddress.trim()) {
        setShippingFee(50000);
      } else {
        setShippingFee(0);
      }
    } else {
      setShippingFee(0); // No shipping fee for "Mua tại shop"
    }
  }, [orderType, shippingAddress]);

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Input
          placeholder="Search products"
          onChange={(e) => {
            const value = e.target.value;
            const filtered = products.filter(
              (product) =>
                product.name.toLowerCase().includes(value.toLowerCase()) ||
                (product.category &&
                  product.category.toLowerCase().includes(value.toLowerCase()))
            );
            setFilteredProducts(filtered);
          }}
          style={{ marginBottom: 16 }}
        />

        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={filteredProducts}
          loading={loading}
          renderItem={(product) => (
            <List.Item>
              <Card
                cover={
                  <img
                    src={product.image}
                    alt="product"
                    style={{ height: 150, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button type="primary" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>,
                ]}
              >
                <Card.Meta title={product.name} />
                <Select
                  value={product.selectedSizeIndex}
                  onChange={(index) => {
                    product.selectedSizeIndex = index;
                    setProducts([...products]);
                  }}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  {product.sizes.map((size, index) => (
                    <Option key={index} value={index}>
                      {size.size} - {size.price.toFixed(2)} VNĐ
                    </Option>
                  ))}
                </Select>
                <div style={{ marginTop: 8 }}>
                  Price:{" "}
                  {(
                    product.sizes[product.selectedSizeIndex].price || 0
                  ).toFixed(2)}{" "}
                  VNĐ
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Col>

      <Col span={8}>
        <Divider>Customer Details</Divider>
        <Row gutter={8} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Input
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={checkCustomer}>
              Check
            </Button>
          </Col>
        </Row>
        <Input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Divider>Order Details</Divider>
        <Select
          value={orderType}
          onChange={(value) => setOrderType(value)}
          style={{ marginBottom: 16, width: "100%" }}
        >
          <Option value="shop">Mua tại shop</Option>
          <Option value="online">Mua online</Option>
        </Select>
        {orderType === "online" && (
          <Input
            placeholder="Enter shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        )}

        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <Row align="middle">
                  <Col span={6}>
                    <img
                      src={item.image}
                      alt="product"
                      style={{ width: 50, marginRight: 8 }}
                    />
                  </Col>
                  <Col span={18} style={{ fontWeight: "bold" }}>
                    {item.name}
                  </Col>
                </Row>
                <Row
                  style={{
                    width: "100%",
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  align="middle"
                >
                  <Col span={6}>
                    <div>
                      Unit Price: {item.selectedSize.price.toFixed(2)} VNĐ
                    </div>
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        updateQuantity(item.cartItemKey, value)
                      }
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col span={6}>
                    <div>
                      Total:{" "}
                      {(item.quantity * item.selectedSize.price).toFixed(2)} VNĐ
                    </div>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Button
                      type="text"
                      style={{ color: "red" }}
                      onClick={() => removeFromCart(item.cartItemKey)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )}
        />
        <Divider />
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>Subtotal:</Col>
          <Col>
            {(calculateTotal() - discount + shippingFee).toFixed(2)} VNĐ
          </Col>
        </Row>
        {orderType === "online" && (
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>Shipping Fee:</Col>
            <Col>{shippingFee.toFixed(2)} VNĐ</Col>
          </Row>
        )}
        <Input
          placeholder="Promo Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={applyDiscount} block>
          Apply Discount
        </Button>
        <Button type="primary" block style={{ marginTop: 16 }}>
          Pay Now
        </Button>
      </Col>
    </Row>
  );
};

export default Sales;

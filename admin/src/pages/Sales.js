import React, { useEffect, useState, useCallback } from "react";
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
import jwt from "jsonwebtoken"

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
  const [orderType, setOrderType] = useState("shop");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isExistCustomer, setIsExistCustomer] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [customerDiscount, setCustomerDiscount] = useState(0)
  const [subtotal, setSubtotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  // const [isReset, setIsReset] = useState(false);
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

    const cartItemKey = `${product._id}-${selectedSize.size}`;
    const existingProduct = cart.find(
      (item) => item.cartItemKey === cartItemKey
    );

    cart.forEach(item => console.log(item))
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
  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      if (item.selectedSize && item.selectedSize.price) {
        return total + item.selectedSize.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cart]);

  // Apply discount based on promo code

  useEffect(() => {
    const calculatedSubtotal = calculateTotal();
    setSubtotal(calculatedSubtotal);

    let calculatedDiscountedTotal;
    if (customerDiscount === 0) {
      calculatedDiscountedTotal = calculatedSubtotal - calculatedSubtotal * discount / 100;
    } else {
      let customerDiscountedTotal = calculatedSubtotal * customerDiscount / 100;
      let promoDiscountedTotal = calculatedSubtotal * discount / 100;

      calculatedDiscountedTotal = calculatedSubtotal - promoDiscountedTotal - customerDiscountedTotal;
    }
    setDiscountedTotal(Math.max(calculatedDiscountedTotal, 0));

    const calculatedFinalTotal = Math.max(calculatedDiscountedTotal + shippingFee, 0);
    setTotalPrice(calculatedFinalTotal);
  }, [cart, discount, shippingFee, customerDiscount, calculateTotal]);




  const applyDiscount = async () => {
    if (!promoCode) {
      return message.error("Invalid promo code");
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/promotion/get-promotion-by-code/${promoCode}`,
        {
          validateStatus: (status) => status < 500,
        }
      )

      if (response.status === 200 && response.data) {
        message.success("Code applied");
        console.log(response.data.discount)
        setDiscount(response.data.discount)
      } else if (response.status === 404) {
        message.info("Code not found");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error apply code:", error);
    }
  };
  // Check customer by phone number
  const checkCustomer = async () => {
    if (!customerPhone) {
      message.error("Please enter the customer's phone number");
      return false;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/customer/get-customer-by-phone/${customerPhone}`,
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 200 && response.data) {
        console.log(response.data.userDiscount)
        setCustomerDiscount(response.data.userDiscount)
        setCustomerName(response.data.name);
        message.success("Customer found");
        setIsExistCustomer(true)
      } else if (response.status === 404) {
        setCustomerDiscount(0)
        message.info("Customer not found, please create a new invoice to create the customer.");
        setIsExistCustomer(false)
      } else {
        message.error(`Error: ${response.status} - ${response.statusText}`);
        setIsExistCustomer(false)
      }

    } catch (error) {
      console.error("Error fetching customer data:", error);
      message.error("An error occurred while fetching customer data.");
      setIsExistCustomer(false)
    }
  };

  const handleUpdateQuantityByInvoice = async () => {
    console.log(cart)
    try {
      const response = await axios.patch(`http://localhost:3001/product/update-quatity-by-sales`, { cart }, {
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        // message.success("Product quantities updated successfully!");
        return true;
      } else {
        message.error(`Error: ${response.status} - ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error("Error updating product quantities:", error);
      message.error("An error occurred while updating product quantities. Please try again later.");
      return false;
    }
  };



  const createInvoiceWithDetails = async () => {
    if (cart.length === 0) {
      message.error("Please add product");
      return;
    }
    if (orderType === 'online' && !shippingAddress) {
      message.error("Please enter shipping address");
      return;
    }
    const decoded = jwt.decode(localStorage.getItem("token"));
    const userId = decoded.userId

    const invoiceData = {
      customerPhone,
      userId,
      customerDiscount,
      orderType,
      promoCode,
      shippingAddress,
      shippingFee,
      cart,
      totalPrice,
    };

    try {
      if (cart.length !== 0 && !isExistCustomer) {
        const checkCustomer = await handleCreateCustomerByPhone();
        if (!checkCustomer) {
          return;
        }
      }
      const response = await axios.post(
        "http://localhost:3001/invoice/create-invoice",
        invoiceData
      );

      if (response.status === 201) {
        const updateQuantity = await handleUpdateQuantityByInvoice()
        if (!updateQuantity) {
          return;
        }
        console.log("Invoice created:", response.data);
        message.success("Invoice created successfully!");
        setCustomerPhone("")
        setCustomerDiscount(0)
        setCustomerName("")
        setOrderType("shop")
        setPromoCode("")
        setShippingAddress(0)
        setTotalPrice(0)
        setCart([])
        fetchProducts()
      } else {
        console.error("Error:", response.data.message || "Unknown error");
        message.error(response.data.message || "Failed to create invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error);
      message.error(
        error.response?.data?.message || "An error occurred while creating the invoice."
      );
    }
  };

  const handleCreateCustomerByPhone = async () => {
    if (!customerName || !customerPhone) {
      message.error("Please enter both customer name and phone number.");
      return;
    }
    if (customerPhone.length !== 10) {
      message.error("Phone number must have 10 digits.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/customer/create-customer`,
        {
          name: customerName,
          phonenumber: customerPhone,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Created new customer successfully");
        return true;
      } else if (response.status === 400) {
        message.error(response.data.message);
        return false;
      } else {
        message.error(`Error: ${response.status} - ${response.statusText}`);
        return false;
      }

    } catch (error) {
      console.error("Error creating customer:", error);
      message.error("An error occurred while creating the customer.");
      return false
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

        <div style={{ maxHeight: "680px", overflowY: "auto", paddingRight: "8px" }}>
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
                    <Button
                      type="primary"
                      onClick={() => addToCart(product)}
                      disabled={product.sizes[product.selectedSizeIndex].quantity === 0}
                    >
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
                        {size.size}
                      </Option>
                    ))}
                  </Select>
                  <div style={{ marginTop: 8 }}>
                    Quantity: {product.sizes[product.selectedSizeIndex].quantity || 0}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    Price:{" "}
                    {(
                      product.sizes[product.selectedSizeIndex].price || 0
                    ).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}{" "}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
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
          <Col span={8} style={{ display: 'flex' }}>
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
                  <Col span={4}>
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
                  <Col span={4}>
                    <div>
                      Unit Price: {item.selectedSize.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </div>
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        updateQuantity(item.cartItemKey, value)
                      }
                      style={{ width: "80%" }}
                    />
                  </Col>
                  <Col span={4}>
                    <div>
                      Size: {item.selectedSize.size}
                    </div>
                  </Col>
                  <Col span={4}>
                    <div>
                      Total:{" "}
                      {(item.quantity * item.selectedSize.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
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
          <Col>Subtotal (Before Discount):</Col>
          <Col>{subtotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</Col>
        </Row>

        <Row justify="space-between" style={{ marginBottom: 16 }}>

          <Col>Discounted Total:</Col>
          <Col>{discountedTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</Col>
        </Row>


        {orderType === "online" && (
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>Shipping Fee:</Col>
            <Col>{shippingFee.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</Col>
          </Row>
        )}


        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>Total (After Discount + Shipping):</Col>
          <Col>{totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</Col>
        </Row>


        <Col style={{ display: 'flex' }}>
          <Input
            placeholder="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ flex: 2, marginRight: 8 }}
          />
          <Button style={{ flex: 1 }} type="primary" onClick={applyDiscount} block>
            Apply Discount
          </Button>
        </Col>
        <Button
          onClick={() => createInvoiceWithDetails()}
          type="primary"
          block
          style={{ marginTop: 16 }}
        >
          Pay Now
        </Button>
      </Col>
    </Row>
  );
};

export default Sales;

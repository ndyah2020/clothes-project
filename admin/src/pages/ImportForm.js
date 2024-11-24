import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, InputNumber, Button, Table, Typography, message } from "antd";
import jwt from "jsonwebtoken"

const { Option } = Select;
const { Title } = Typography;
const ImportNote = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/supplier/get-supplier");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error loading supplier list:", error);
      message.error("Error loading supplier list");
    }
  };

  const fetchProductsBySupplier = async (supplierId) => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`http://localhost:3001/product/get-products/supplier/${supplierId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading product list:", error);
      message.error("Error loading product list");
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProductToTable = () => {
    if (
      !selectedProduct ||
      !selectedSize ||
      productQuantity <= 0 ||
      productPrice <= 0
    ) {
      message.warning(
        "Please select a valid product, size, quantity, and price"
      );
      return;
    }

    const productExists = selectedProducts.find(
      (product) =>
        product.id === selectedProduct._id && product.size === selectedSize
    );

    if (productExists) {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct._id && product.size === selectedSize
            ? {
              ...product,
              quantity: product.quantity + productQuantity,
              price: productPrice,
              total: (product.quantity + productQuantity) * productPrice,
            }
            : product
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: selectedProduct._id,
          name: selectedProduct.name,
          size: selectedSize,
          price: productPrice,
          quantity: productQuantity,
          total: productQuantity * productPrice,
        },
      ]);
    }

    setSelectedProduct(null);
    setSelectedSize("");
    setProductQuantity(1);
    setProductPrice(0);
    message.success("Product added to the list");
  };

  const removeProduct = (productId, size) => {
    setSelectedProducts((prev) =>
      prev.filter(
        (product) => !(product.id === productId && product.size === size)
      )
    );
    message.success("Product removed from the list");
  };

  const createImportNote = async () => {
    if (!selectedSupplier) {
      message.warning("Please select a supplier");
      return;
    }
    if (selectedProducts.length === 0) {
      message.warning("Please select at least one product");
      return;
    }
    const decoded = jwt.decode(localStorage.getItem("token"));
    const noteData = {
      supplierId: selectedSupplier,
      userId: decoded.userId,
      products: selectedProducts,
    };
    console.log(noteData)
    try {
      const response = await axios.post(
        "http://localhost:3001/import-note/create-import-note",
        {noteData},
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      console.log(response)
      if (response.status === 200 && response.data) {
        message.success("Import note successfully created!");
        console.log(response.data.message);
      
        setSelectedSupplier("");
        setSelectedProducts([]);
        setProducts([]);
        setSelectedProduct(null);
        setSelectedSize("");
        setProductQuantity(1);
        setProductPrice(0);
      } else if (response.status === 404) {
        message.info(response.data.message);
      } else {
        message.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error creating import note:", error);
      message.error("Failed to create import note. Please try again.");
    }
  };
  


  useEffect(() => {
    fetchSuppliers();
  }, []);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button danger onClick={() => removeProduct(record.id, record.size)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Import Note</Title>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Left Column */}
        <div>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Select Supplier:</span>
            <Select
              placeholder="Select a supplier"
              style={{ width: "100%", marginTop: "5px" }}
              value={selectedSupplier}
              onChange={(value) => {
                setSelectedSupplier(value);
                setProducts([]);
                setSelectedProduct(null);
                fetchProductsBySupplier(value);
              }}
              disabled={selectedProducts.length !== 0  || selectedProduct}
            >
              {suppliers.map((supplier) => (
                <Option 
                  key={supplier._id} 
                  value={supplier._id}
                >
                  {supplier.name}
                </Option>     
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Select Product:</span>
            <Select
              placeholder="Select a product"
              style={{ width: "100%", marginTop: "5px" }}
              value={selectedProduct ? selectedProduct._id : null}
              onChange={(value) =>
                setSelectedProduct(
                  products.find((product) => product._id === value)
                )
              }
              disabled={!selectedSupplier || loadingProducts}
            >
              <Option
                onChange={() => setSelectedProduct(null)}
              >
                None
              </Option>

              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Size:</span>
            <Select
              placeholder="Select size"
              style={{ width: "100%", marginTop: "5px" }}
              value={selectedSize}
              onChange={(value) => setSelectedSize(value)}
              disabled={!selectedProduct}
            >
              {selectedProduct &&
                selectedProduct.sizes.map((size) => (
                  <Option key={size.size} value={size.size}>
                    {size.size}
                  </Option>
                ))}
            </Select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Quantity:</span>
            <InputNumber
              placeholder="Enter quantity"
              min={1}
              style={{ width: "100%", marginTop: "5px" }}
              value={productQuantity}
              onChange={(value) => setProductQuantity(value)}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Price (VND):</span>
            <InputNumber
              placeholder="Enter price"
              min={0}
              style={{ width: "100%", marginTop: "5px" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"
              }
              parser={(value) => value.replace(/\VND\s?|(,*)/g, "")}
              value={productPrice}
              onChange={(value) => setProductPrice(value)}
            />
          </div>
        </div>
      </div>

      <Button
        type="primary"
        onClick={addProductToTable}
        style={{ marginBottom: "20px" }}
      >
        Add to List
      </Button>

      <Table
        dataSource={selectedProducts}
        columns={columns}
        rowKey={(record) => `${record.id}-${record.size}`}
        pagination={false}
      />

      <Button
        type="primary"
        disabled={!selectedSupplier || selectedProducts.length === 0}
        onClick={createImportNote}
        style={{ marginTop: "20px" }}
      >
        Create Import Note
      </Button>
    </div>
  );
};

export default ImportNote;

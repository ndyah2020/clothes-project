import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  InputNumber,
  Button,
  Table,
  Space,
  Typography,
  message,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const ImportNote = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch suppliers
  useEffect(() => {
    axios
      .get("http://localhost:3001/supplier/get-supplier")
      .then((response) => setSuppliers(response.data))
      .catch((error) => message.error("Lỗi khi tải danh sách nhà cung cấp"));
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3001/product/get-products")
      .then((response) => setProducts(response.data))
      .catch((error) => message.error("Lỗi khi tải danh sách sản phẩm"));
  }, []);

  // Handle adding product to table
  const addProductToTable = () => {
    if (!selectedProduct || !selectedSize || productQuantity <= 0) {
      message.warning("Vui lòng chọn sản phẩm, kích cỡ và số lượng hợp lệ");
      return;
    }

    const sizeInfo = selectedProduct.sizes.find(
      (size) => size.size === selectedSize
    );

    if (!sizeInfo) {
      message.error("Kích cỡ không hợp lệ");
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
            ? { ...product, quantity: product.quantity + productQuantity }
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
          price: sizeInfo.price,
          quantity: productQuantity,
        },
      ]);
    }

    setSelectedProduct(null);
    setSelectedSize("");
    setProductQuantity(1);
    message.success("Đã thêm sản phẩm vào danh sách");
  };

  // Handle removing a product from table
  const removeProduct = (productId, size) => {
    setSelectedProducts((prev) =>
      prev.filter(
        (product) => !(product.id === productId && product.size === size)
      )
    );
    message.success("Đã xóa sản phẩm khỏi danh sách");
  };

  // Handle creating import note
  const createImportNote = () => {
    if (!selectedSupplier) {
      message.warning("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (selectedProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    const noteData = {
      supplierId: selectedSupplier,
      products: selectedProducts,
    };
    console.log("Phiếu nhập:", noteData);
    message.success("Phiếu nhập đã được tạo thành công!");
    // Add your API call here to save the import note
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (text, record) =>
        `${(record.quantity * record.price).toLocaleString()} VNĐ`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button danger onClick={() => removeProduct(record.id, record.size)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Phiếu Nhập</Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Select Supplier */}
        <Space>
          <span>Chọn nhà cung cấp:</span>
          <Select
            placeholder="Chọn nhà cung cấp"
            style={{ width: 300 }}
            value={selectedSupplier}
            onChange={(value) => setSelectedSupplier(value)}
          >
            {suppliers.map((supplier) => (
              <Option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Select Product */}
        <Space>
          <span>Chọn sản phẩm:</span>
          <Select
            placeholder="Chọn sản phẩm"
            style={{ width: 300 }}
            value={selectedProduct ? selectedProduct._id : null}
            onChange={(value) =>
              setSelectedProduct(
                products.find((product) => product._id === value)
              )
            }
          >
            {products.map((product) => (
              <Option key={product._id} value={product._id}>
                {product.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn kích cỡ"
            style={{ width: 150 }}
            value={selectedSize}
            onChange={(value) => setSelectedSize(value)}
            disabled={!selectedProduct}
          >
            {selectedProduct &&
              selectedProduct.sizes.map((size) => (
                <Option key={size.size} value={size.size}>
                  {size.size} - {size.price.toLocaleString()} VNĐ
                </Option>
              ))}
          </Select>
          <InputNumber
            min={1}
            value={productQuantity}
            onChange={(value) => setProductQuantity(value)}
          />
          <Button type="primary" onClick={addProductToTable}>
            Thêm vào danh sách
          </Button>
        </Space>

        {/* Table */}
        <Table
          dataSource={selectedProducts}
          columns={columns}
          rowKey={(record) => `${record.id}-${record.size}`}
          pagination={false}
          style={{ marginTop: "20px" }}
        />

        {/* Create Import Note */}
        <Button
          type="primary"
          disabled={!selectedSupplier || selectedProducts.length === 0}
          onClick={createImportNote}
        >
          Tạo phiếu
        </Button>
      </Space>
    </div>
  );
};

export default ImportNote;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, InputNumber, Button, Table, Typography, message } from "antd";

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

  useEffect(() => {
    axios
      .get("http://localhost:3001/supplier/get-supplier")
      .then((response) => setSuppliers(response.data))
      .catch(() => message.error("Lỗi khi tải danh sách nhà cung cấp"));
  }, []);

  const fetchProductsBySupplier = (supplierId) => {
    setLoadingProducts(true);
    axios
      .get(`http://localhost:3001/product/get-products/supplier/${supplierId}`)
      .then((response) => setProducts(response.data))
      .catch(() => message.error("Lỗi khi tải danh sách sản phẩm"))
      .finally(() => setLoadingProducts(false));
  };

  const addProductToTable = () => {
    if (
      !selectedProduct ||
      !selectedSize ||
      productQuantity <= 0 ||
      productPrice <= 0
    ) {
      message.warning(
        "Vui lòng chọn sản phẩm, kích cỡ, số lượng và giá nhập hợp lệ"
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
    message.success("Đã thêm sản phẩm vào danh sách");
  };

  const removeProduct = (productId, size) => {
    setSelectedProducts((prev) =>
      prev.filter(
        (product) => !(product.id === productId && product.size === size)
      )
    );
    message.success("Đã xóa sản phẩm khỏi danh sách");
  };

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
      title: "Giá nhập",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} VNĐ`,
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
            <span style={{ fontWeight: "bold" }}>Chọn nhà cung cấp:</span>
            <Select
              placeholder="Chọn nhà cung cấp"
              style={{ width: "100%", marginTop: "5px" }}
              value={selectedSupplier}
              onChange={(value) => {
                setSelectedSupplier(value);
                setProducts([]);
                setSelectedProduct(null);
                fetchProductsBySupplier(value);
              }}
            >
              {suppliers.map((supplier) => (
                <Option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Chọn sản phẩm:</span>
            <Select
              placeholder="Chọn sản phẩm"
              style={{ width: "100%", marginTop: "5px" }}
              value={selectedProduct ? selectedProduct._id : null}
              onChange={(value) =>
                setSelectedProduct(
                  products.find((product) => product._id === value)
                )
              }
              disabled={!selectedSupplier || loadingProducts}
            >
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
            <span style={{ fontWeight: "bold" }}>Kích cỡ:</span>
            <Select
              placeholder="Chọn kích cỡ"
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
            <span style={{ fontWeight: "bold" }}>Số lượng:</span>
            <InputNumber
              placeholder="Nhập số lượng"
              min={1}
              style={{ width: "100%", marginTop: "5px" }}
              value={productQuantity}
              onChange={(value) => setProductQuantity(value)}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Giá nhập (VNĐ):</span>
            <InputNumber
              placeholder="Nhập giá tiền"
              min={0}
              style={{ width: "100%", marginTop: "5px" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VNĐ"
              }
              parser={(value) => value.replace(/\s?|(,*)/g, "")}
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
        Thêm vào danh sách
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
        Tạo phiếu
      </Button>
    </div>
  );
};

export default ImportNote;

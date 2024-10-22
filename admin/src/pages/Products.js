import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option, OptGroup } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]); // State for managing the upload file list
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
        return product;
      });

      setProducts(productsWithImages);
      setFilteredProducts(productsWithImages);
    } catch (error) {
      message.error("Failed to fetch products");
    }
    setLoading(false);
    
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (value) => {
    // Filter products by selected category
    const categoryProducts = products.filter((product) => product.category === value);

    // Extract the numerical part of the SKU for the selected category, safely handling NaN
    const skus = categoryProducts.map((product) => {
      const skuParts = product.sku.split('-');
      return parseInt(skuParts[1], 10); // Get the number part from SKU and convert to integer
    }).filter((num) => !isNaN(num)); // Filter out NaN values

    // Find the highest SKU number and increment it
    const nextSkuNumber = skus.length > 0 ? Math.max(...skus) + 1 : 1;

    // Format the number with leading zeros (e.g., 001, 002, etc.)
    const formattedNumber = nextSkuNumber.toString().padStart(3, '0');

    // Generate SKU in the format 'category-001'
    const generatedSku = `${value}-${formattedNumber}`;

    // Set the generated SKU in the form
    form.setFieldsValue({ sku: generatedSku.toUpperCase() });
  };

  // Handle search and filter
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || product.status === statusFilter;
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, categoryFilter, products]);

  // Display modal for creating or editing products
  const showModal = (product) => {
    form.resetFields();
    setImageFile(null);
    setImageUrl(null);
    setFileList([]); // Reset the file list here
    setIsModalVisible(true);

    if (product) {
      form.setFieldsValue(product);
      setEditingProduct(product);
      setImageUrl(product.image || null);
    } else {
      setEditingProduct(null);
    }
  };
  // Handle form submission to create or update product
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("sku", values.sku);
      formData.append("name", values.name);
      formData.append("description", values.description); // Add description to the FormData
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("status", values.status);

      if (imageFile) {
        formData.append("images", imageFile);
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3001/product/update-product/${editingProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:3001/product/create-product",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Product created successfully");
      }

      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save product");
    }
    setLoading(false);
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3001/product/delete-product/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
    setLoading(false);
  };

  // Handle image upload with file list management
  const handleBeforeUpload = (file) => {
    setImageFile(file);
    setFileList([file]); // Update the file list with the uploaded file

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img src={image} alt="product" style={{ width: 50 }} />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button onClick={() => showModal(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="link" danger>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row justify="end">
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ marginBottom: 8 }}
        >
          Add Product
        </Button>
      </Row>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search by SKU or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Status"
            value={statusFilter || undefined} // Ensure undefined to display placeholder
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 150, marginRight: 8 }}
            allowClear
          >
            <Option value="in_stock">In Stock</Option>
            <Option value="out_of_stock">Out of Stock</Option>
            <Option value="restocking">Restocking</Option>
            <Option value="discontinued">Discontinued</Option>
          </Select>
          <Select
            placeholder="Filter by Category"
            value={categoryFilter || undefined} // Ensure undefined to display placeholder
            onChange={(value) => setCategoryFilter(value)}
            style={{ width: 150 }}
            allowClear
          >
            <OptGroup label="Shirts">
              <Option value="T-shirt">T-shirt</Option>
              <Option value="Shirt">Shirt</Option>
              <Option value="Jacket">Jacket</Option>
              <Option value="Sweater">Sweater</Option>
              <Option value="Turtleneck">Turtleneck</Option>
            </OptGroup>
            <OptGroup label="Pants">
              <Option value="Jeans">Jeans</Option>
              <Option value="Shorts">Shorts</Option>
              <Option value="Joggers">Joggers</Option>
              <Option value="Trousers">Trousers</Option>
            </OptGroup>
            <OptGroup label="Underwear">
              <Option value="Underwear">Underwear</Option>
              <Option value="Bra">Bra</Option>
            </OptGroup>
            <OptGroup label="Accessories">
              <Option value="Scarf">Scarf</Option>
              <Option value="Hat">Hat</Option>
            </OptGroup>
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowKey="_id"
      />
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select onChange={handleCategoryChange}>
              <OptGroup label="Shirts">
                <Option value="T-shirt">T-shirt</Option>
                <Option value="Shirt">Shirt</Option>
                <Option value="Jacket">Jacket</Option>
                <Option value="Sweater">Sweater</Option>
                <Option value="Turtleneck">Turtleneck</Option>
              </OptGroup>
              <OptGroup label="Pants">
                <Option value="Jeans">Jeans</Option>
                <Option value="Shorts">Shorts</Option>
                <Option value="Joggers">Joggers</Option>
                <Option value="Trousers">Trousers</Option>
              </OptGroup>
              <OptGroup label="Underwear">
                <Option value="Underwear">Underwear</Option>
                <Option value="Bra">Bra</Option>
              </OptGroup>
              <OptGroup label="Accessories">
                <Option value="Scarf">Scarf</Option>
                <Option value="Hat">Hat</Option>
              </OptGroup>
            </Select>
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please input the SKU" }]}
          >
            <Input value={''}/>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the product name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the product description",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Option value="in_stock">In Stock</Option>
              <Option value="out_of_stock">Out of Stock</Option>
              <Option value="restocking">Restocking</Option>
              <Option value="discontinued">Discontinued</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={handleBeforeUpload}
              fileList={fileList}
              onRemove={() => {
                setImageFile(null);
                setImageUrl(null);
                setFileList([]);
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{ width: "100%", marginTop: 10 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;

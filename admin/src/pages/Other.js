import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  message,
  Row,
  Col,
} from "antd";

import axios from "axios";

const { Option} = Select;

const Other = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");


  // Fetch product list
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/product/get-products");
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

  // Handle search and filter
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || product.status === statusFilter;
      const matchesCategory = !categoryFilter || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, categoryFilter, products]);


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      //Dữ liệu giá và số lượng sẽ theo hiện ra theo size
      title: "Price",
      dataIndex: "sizes",
      key: "price",
      render: (sizes, record) => {
        const defaultSize = record.selectedSize !== undefined ? record.selectedSize : 0;
        return sizes.length > 0 ? `${sizes[defaultSize].price.toFixed(2)} VNĐ` : "No Data";
      },
    },
    {
      title: "Quantity",
      dataIndex: "sizes",
      key: "quantity",
      render: (sizes, record) => {
        const defaultSize = record.selectedSize !== undefined ? record.selectedSize : 0; 
        return sizes.length > 0 ? sizes[defaultSize].quantity : "No Data";
      },
    },
    {
      title: "Size",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes, record) => {
        return (
          <Select
            onChange={(value) => {
              record.selectedSize = value;
              setProducts([...products]);  
            }}
            value={record.selectedSize !== undefined ? record.selectedSize : 0}  
          >
            {sizes.map((size, index) => (
              <Option key={index} value={index}>
                {size.size}
              </Option>
            ))}
          </Select>
        );
      }      
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
    
  ];

  return (
    <div>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
            <Input
                placeholder="Search employees"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
            />
            </Col>
        </Row>

        <Table
            columns={columns}
            dataSource={filteredProducts}
            loading={loading}
            rowKey="_id"
        />
        {/* modal detail */}
    </div>
  );
};

export default Other;

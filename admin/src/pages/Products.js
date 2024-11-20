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
  const [newSizeByProduct, setNewSizeByProduct] = useState({});
  const [showSizes, setShowSize] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [getSupplierById, setGetSupplierById] = useState("")
  const validSizes = ["S", "M", "L", "XL", "XXL"];
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState(null);
  
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
  
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:3001/supplier/get-supplier");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      message.error("Failed to fetch supplier.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleCategoryChange = (value) => {
    const categoryProducts = products.filter(
      (product) => product.category === value
    );
  
    const skus = categoryProducts
      .map((product) => {
        const skuParts = product.sku.split("-");
        return parseInt(skuParts[1], 10); // Get the number part from SKU and convert to integer
      })
      .filter((num) => !isNaN(num)) // Filter out NaN values
      .sort((a, b) => a - b); // Sort SKU numbers in ascending order
  
    // Find the first missing SKU number in the sequence
    let nextSkuNumber = 1;
    for (let i = 0; i < skus.length; i++) {
      if (skus[i] !== nextSkuNumber) {
        break; // We've found a gap, so use this number
      }
      nextSkuNumber++;
    }
  
    // Format the number with leading zeros (e.g., 001, 002, etc.)
    const formattedNumber = nextSkuNumber.toString().padStart(3, "0");
  
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
      const matchesCategory = !categoryFilter || product.category === categoryFilter;

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


  const showDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalVisible(true);
    handleGetSupplierById(product)
  };


   const handleGetSupplierById = async (product) => {
    console.log(product.supplier)
      try{
        const response = await fetch(`http://localhost:3001/supplier/get-supplier/${product.supplier}`)
        const data = await response.json();
        setGetSupplierById(data)
      }catch(error){
          console.error("Error fetching supplier:", error);
          message.error("Failed to fetch supplier.");
      }
  }

  // Handle form submission to create or update product
  const handleSubmit = async (values) => {
    setLoading(true);

    if (values.size) {
      if (!validSizes.includes(values.size.toUpperCase())) {
        return message.error("Valid size is S, M, L, XL, XXL");
      }
    }
  
    try {
      const formData = new FormData();
      formData.append("sku", values.sku);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("status", values.status);
      formData.append("supplier", values.supplier);
  
      if (values.size && validSizes.includes(values.size.toUpperCase())) {
        formData.append("size", values.size.toUpperCase());
      }


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
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa sản phẩm này?",
      content: "Thao tác này sẽ không thể hoàn tác và mất toàn bộ dữ liệu về sản phẩm.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true); // Bắt đầu trạng thái loading
        try {
          await axios.delete(`http://localhost:3001/product/delete-product/${id}`);
          message.success("Xóa sản phẩm thành công!");
          fetchProducts(); // Cập nhật lại danh sách sản phẩm sau khi xóa thành công
        } catch (error) {
          message.error("Xóa sản phẩm thất bại.");
        } finally {
          setLoading(false); // Kết thúc trạng thái loading, bất kể thành công hay thất bại
        }
      }
    });
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
 
  //Thêm size khi ấn enter
  const handleAddSize = async (size, id) => {
    const upperSize = size.toUpperCase();

    const isSize = validSizes.includes(upperSize);

    if (!isSize) {
      return message.error("Valid size is S, M, L, XL, XXL");
    }
    try {
      const response = await fetch(`http://localhost:3001/product/addsize/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size: upperSize }), 
      });
      fetchProducts();
      setNewSizeByProduct(() => ({[id]: "" }));
      if (!response.ok) {
        const result = await response.json();
        return message.error(result.message);
      }

      message.success("Size added successfully");
    } catch (error) {
      message.error("Failed to add size");
    }
  };
  //Xóa size
  const handleDeleteSize =  (size, id, value) => {  
    Modal.confirm({
      title: "Bạn có chắc muốn xóa size này?",
      content: "Thao tác này sẽ không thể hoàn tác và mất toàn bộ dữ liệu về size.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
    onOk: async () => {
        if(value.length === 1) 
          return message.error("No sizes left. You can add new sizes.");

        const upperSize = size.toUpperCase();
        try {
          const response = await fetch(`http://localhost:3001/product/deletesize/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ size: upperSize }),
          });
          if (!response.ok) {
            const result = await response.json();
            return message.error(result.message);
          }
      
          // Cập nhật lại dữ liệu sản phẩm sau khi xóa size thành công
          const updatedProduct = await axios.get(
            `http://localhost:3001/product/get-product/${id}`
          );
    
          // Đặt lại giá trị form với dữ liệu mới
          setEditingProduct(updatedProduct.data);
          form.setFieldsValue(updatedProduct.data); 
          fetchProducts();
          message.success("Size deleted successfully");
        } catch (error) {
          message.error("Failed to delete size");
        }
      }
    })
  }
  //Chỉnh sửa giá của size
  const handleUpdateSizePrice = async (size) => {
    const price = newPrice
    try {
      const response = await fetch(`http://localhost:3001/product/update-size-price/${editingProduct._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size, price}),
      });
      if (!response.ok) {
        const result = await response.json();
        return message.error(result.message);
      }else{
        message.success("Price updated");
      }
      const updatedProduct = await axios.get(
        `http://localhost:3001/product/get-product/${editingProduct._id}`
      );
      setEditingProduct(updatedProduct.data);
      form.setFieldsValue(updatedProduct.data); 
    } catch (error) {
      message.error("Failed to change price");
    }
  }

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
        return  `${sizes[defaultSize].price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} `;
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
    {
      title: "Add Size",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes, record) => (
        <Input
          style={{ width: 100 }}
          placeholder="Enter to add size"
          value={newSizeByProduct[record._id] || ""} // Lấy giá trị từ trạng thái dựa trên id sản phẩm
          onChange={(e) =>
            setNewSizeByProduct(() => ({
              [record._id]: e.target.value,
            }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddSize(newSizeByProduct[record._id], record._id); // Thêm size cho sản phẩm hiện tại
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
         <Button onClick={() => showDetailModal(record)} type="link">
            Detail
          </Button>
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
      {/* modal detail */}
      <Modal
        title="Product Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedProduct && (
          <div>
            <p><strong>SKU:</strong> {selectedProduct.sku}</p>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Supplier:</strong> {getSupplierById.name}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Status:</strong> {selectedProduct.status}</p>
            <p><strong>Sizes:</strong></p>
            <ul>
              {selectedProduct.sizes.map((size, index) => (
                <li key={index}>
                  <strong>Size:</strong> {size.size}, 
                  <strong> Price:</strong> {size.price} VNĐ, 
                  <strong> Quantity:</strong> {size.quantity}
                </li>
              ))}
            </ul>
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt="Product"
                style={{ width: 100, marginTop: 10 }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* eidt and add */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
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
              name="supplier"
              label="Supplier"
            >
              <Select>
                {suppliers.map((supplier, index) => (
                  <Option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </Option>
                ))}
              </Select>
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
            {!editingProduct && (
                <Form.Item
                  name="size"
                  label="First size"
                  rules={[
                    { required: true, message: "Please input the product size" },
                  ]}
                  >
                  <Input />
                </Form.Item>
            )}
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                message: "Please input the product description",
              },
            ]}
          >
            <Input.TextArea rows={4} />
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

          {editingProduct && (
            <Form.Item label="Sizes">

              <Select
                style={{ marginBottom: 10 }}
                onChange={(index) => {
                  setShowSize(index); 
                  setNewPrice(null)
                }}
                value={editingProduct.sizes[showSizes] ? editingProduct.sizes[showSizes].size : editingProduct.sizes[0].size}
              >
                {editingProduct.sizes.map((size, index) => (
                  <Option key={index} value={index}>
                    {size.size}
                  </Option>
                ))}
              </Select>

        
              <Form.Item label="Price">
              <Row gutter={10} align="middle">
                <Col span={18}>
                  <Input
                    onChange={(e) => setNewPrice(e.target.value)}
                    value={newPrice !== null ? newPrice : editingProduct.sizes[showSizes].price}
                  />
                </Col>
                <Col span={6}>
                  <Button
                    style={{ backgroundColor: "green", color: "white", width: "100%" }} // Nút chiếm toàn bộ chiều rộng cột
                    onClick={() => handleUpdateSizePrice(editingProduct.sizes[showSizes].size)}
                  >
                    Update Price
                  </Button>
                </Col>
              </Row>
            </Form.Item>


              
              <Form.Item label="Quantity">
                <Input          
                  value={editingProduct.sizes[showSizes].quantity} 
                  disabled = {editingProduct}
                />
              </Form.Item>
           
            
              <Button 
                style={{color: 'white', backgroundColor: 'red'}} 
                onClick={() =>{
                  setShowSize(0)
                  handleDeleteSize(editingProduct.sizes[showSizes].size, editingProduct._id,editingProduct.sizes)
                }
              }
              >
                Delete Size
              </Button>

            </Form.Item>
          )}

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

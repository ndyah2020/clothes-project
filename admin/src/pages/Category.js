import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Row,
  Col,
  message,
  Badge,
} from "antd";
const { Option } = Select;

const Category = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategorys, setCurrentCategorys] = useState(null);
  const [category, setCategory] = useState([]);

  // Hàm lấy danh sách người dùng từ API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/category/get-category");
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error("Error fetching categorys:", error);
      message.error("Failed to fetch categorys.");
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  useEffect(() => {
    if (isEditMode && currentCategorys) {
      form.setFieldsValue({
        name: currentCategorys.name,
      });
    } else {
      form.resetFields();
    }
  }, [currentCategorys, isEditMode, form]);

  const filteredData = category.filter((category) =>
    Object.values(category).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
    setIsEditMode(false);
    setCurrentCategorys(null);
  };

  const handleOk = async (values) => {
    const { 
      name,
      status,
    } = values;

    try {
      const response = isEditMode
        ? await fetch(
          `http://localhost:3001/category/update-category/${currentCategorys._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              status,
            }),
          }
        )
        : await fetch("http://localhost:3001/category/create-category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        });

      if (response.ok) {
        message.success(
          `Category ${isEditMode ? "updated" : "created"} successfully!`
        );
        fetchData();
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save category."}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (!isEditMode) {
      form.resetFields();
    }
  };

  const handleEdit = (category) => {
    setCurrentCategorys(category);
    setIsEditMode(true);
    setIsModalVisible(true);
  };


  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search categorys"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Create New Category
          </Button>
        </Col>
      </Row>

      <Table
        columns={[
          {
            title: "Category Id",
            dataIndex: "categoryCode",
          }, 
          {
            title: "Category Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: "Status",
            dataIndex: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => {
              const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              return (
                <Badge
                  color={status === "Available" ? "green" : "red"}
                  text={formattedStatus}
                />
              );
            },
          },
          {
            title: "Actions",
            render: (text, record) => (
              <div>
                <Button onClick={() => handleEdit(record)}>Edit</Button>
              </div>
            ),
          },
        ]}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditMode ? "Edit Category" : "Create New Category"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input />
          </Form.Item>

          {isEditMode && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select
                defaultValue={'in use'}
              >
                <Option value="Available">Available</Option>
                <Option value="Unavailable">Unavailable</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;

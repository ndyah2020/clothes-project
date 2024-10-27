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
} from "antd";

const { Option } = Select;

const Employee = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployees, setCurrentEmployees] = useState(null);
  const [employee, setEmployee] = useState([]);

  // Hàm lấy danh sách người dùng từ API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/employee/get-employee");
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm fetchData khi component được mount
  }, []);

  useEffect(() => {
    if (isEditMode && currentEmployees) {
      form.setFieldsValue(currentEmployees);
    } else {
      form.resetFields();
    }
  }, [currentEmployees, isEditMode, form]);

  const filteredData = employee.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const showModal = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setCurrentEmployees(null);
    form.resetFields(); // Reset form when creating a new user
  };

  const handleOk = async (values) => {
    const { email, password, firstName, lastName, role } = values;

    try {
      const response = isEditMode
        ? await fetch(
            `http://localhost:3001/user/update-user/${currentEmployees._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, firstName, lastName, role }),
            }
          )
        : await fetch("http://localhost:3001/user/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
              role,
            }),
          });

      if (response.ok) {
        message.success(
          `User ${isEditMode ? "updated" : "created"} successfully!`
        );

        if (!isEditMode && role.toLowerCase() === "employee") {
          await fetch("http://localhost:3001/employee/create-from-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              firstName,
              lastName,
              role,
            }),
          });
        }

        fetchData(); 
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save user."}`);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Failed to save user.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if(!isEditMode){
      form.resetFields();
    }
  };

  const handleEdit = (user) => {
    setCurrentEmployees(user);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/user/delete-user/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        message.success("User deleted successfully!");
        fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
      } else {
        const errorData = await response.json();
        message.error(
          `Error: ${errorData.message || "Failed to delete user."}`
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleChangeStatus = async (userId, status) => {
    try {
      const response = await fetch(
        `http://localhost:3001/user/change-status/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountStatus: status }),
        }
      );

      if (response.ok) {
        message.success("User status updated successfully!");
        fetchData(); // Fetch lại danh sách người dùng sau khi cập nhật trạng thái thành công
      } else {
        const errorData = await response.json();
        message.error(
          `Error: ${errorData.message || "Failed to update status."}`
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status.");
    }
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search users"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Create New User
          </Button>
        </Col>
      </Row>

      <Table
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: "Address",
            dataIndex: "address",
            sorter: (a, b) => a.address.localeCompare(b.address),
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: "Position",
            dataIndex: "position",
            render: (value, record) => 
              record.position.charAt(0).toUpperCase() + record.position.slice(1).toLowerCase()
          },
          {
            title: "Status",
            dataIndex: "accountStatus",
            render: (text, record) => (
              <Select
                defaultValue={text}
                onChange={(value) => handleChangeStatus(record._id, value)}
              >
                <Option value="working">Working</Option>
                <Option value="on leave">On Leave</Option>
              </Select>
            ),
          },
          {
            title: "Actions",
            render: (text, record) => (
              <div>
                <Button onClick={() => handleEdit(record)}>Edit</Button>
                <Button
                  type="danger"
                  onClick={() => handleDelete(record._id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditMode ? "Edit User" : "Create New User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email!" }]}
          >
            <Input disabled={isEditMode} />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="employee">Employee</Option>
              <Option value="client">Client</Option>
            </Select>
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          {!isEditMode && (
            <Form.Item
              name="confirm"
              label="Confirm Password"
              rules={[{ required: true, message: "Please confirm password!" }]}
            >
              <Input.Password />
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

export default Employee;

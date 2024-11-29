import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Row,
  Badge,
  Col,
  message,
} from "antd";

const { Option } = Select;

const Users = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([])
  const [users, setUsers] = useState([]);
  const [roleUser, setRoleUser] = useState("");
  const [employeeId, setEmployeeId] = useState("")

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/get-users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users.");
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch("http://localhost:3001/employee/get-employee");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [isModalVisible]);

  useEffect(() => {
    fetchEmployee()
  }, []);

  useEffect(() => {
    if (isEditMode && currentUser) {
      form.setFieldsValue(currentUser);
    } else {
      form.resetFields();
    }
  }, [currentUser, isEditMode, form]);

  const filteredData = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const showModal = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setCurrentUser(null);
    form.resetFields();
  };

  const handleOk = async (values) => {
    const { email, password, firstName, lastName, role, emplyeeSelected } = values;
    try {
      const response = isEditMode
        ? await fetch(
          `http://localhost:3001/user/update-user/${currentUser._id}`,
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
            emplyeeSelected,
          }),
        });

      if (response.ok) {
        message.success(
          `User ${isEditMode ? "updated" : "created"} successfully!`
        );
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
    setRoleUser('')
    if (!isEditMode) {
      form.resetFields();
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue(user);
  };

  // const handleDelete = (id) => {
  //   Modal.confirm({
  //     title: "Bạn có chắc muốn xóa người dùng này?",
  //     content: "Thao tác này sẽ không thể hoàn tác.",
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk: async () => {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:3001/user/delete-user/${id}`,
  //           {
  //             method: "DELETE",
  //           }
  //         );
  //         if (response.ok) {
  //           message.success("Xóa người dùng thành công!");
  //           fetchData();
  //         } else {
  //           const errorData = await response.json();
  //           message.error(
  //             `Lỗi: ${errorData.message || "Xóa người dùng thất bại."}`
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Error deleting user:", error);
  //         message.error("Xóa người dùng thất bại.");
  //       }
  //     },
  //     onCancel() {
  //       message.info("Hủy thao tác xóa người dùng.");
  //     },
  //   });
  // };

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

  const onEmployeeChange = (value) => {
    setEmployeeId(value);
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
            title: "Email",
            dataIndex: "email",
            key: "email", // This will ensure unique keys for each column
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
          },
          {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (value, record) => record.role.charAt(0).toUpperCase() + record.role.slice(1).toLowerCase(),
          },
          {
            title: "Status",
            dataIndex: "accountStatus",
            key: "accountStatus",
            render: (status, record) => (
              <div>
                <Badge
                  color={
                    status === "active"
                      ? "green"
                      : status === "block"
                        ? "red"
                        : "white"
                  }
                  style={{ marginRight: 8 }}
                />
                <Select
                  defaultValue={status}
                  onChange={(value) => handleChangeStatus(record._id, value)}
                  style={{ width: 120 }} // Adjust the width as needed
                >
                  <Option value="active">Active</Option>
                  <Option value="block">Block</Option>
                </Select>
              </div>
            ),
          },
          {
            title: "Actions",
            render: (text, record) => (
              <div>
                <Button onClick={() => handleEdit(record)}>Edit</Button>
                {/* <Button
                  type="danger"
                  onClick={() => handleDelete(record._id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button> */}
              </div>
            ),
          },
        ]}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={isEditMode ? "Edit User" : "Create New User"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          {!isEditMode && (
            <>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Select
                  placeholder="Select role"
                  onChange={(value) => setRoleUser(value)}
                  disabled={roleUser === 'employee'}
                >
                  <Option value="admin">Admin</Option>
                  <Option value="employee">Employee</Option>
                </Select>
              </Form.Item>
              {roleUser === 'employee' && (
                <>
                  <Form.Item
                    name="emplyeeSelected"
                    label="Employee"
                    rules={[{ required: true, message: "Please select an employee!" }]}
                  >
                    <Select
                      placeholder="Select employee"
                      onChange={onEmployeeChange}
                    >
                      {employees
                        .filter((employee) => employee.position === 'employee')
                        .map((employee) => (
                          <Option key={employee._id} value={employee._id}>
                            {employee.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="employeePhone"
                    label="Employee Phone Number"
                  >
                    <Input
                      value={employeeId ? employees.find((employee) => employee._id === employeeId)?.phonenumber : ''}
                      disabled
                    />
                    {console.log(employeeId)}
                  </Form.Item>

                </>
              )}
            </>
          )}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email!" }]}
          >
            <Input
              disabled={isEditMode}
            />
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

          {!isEditMode && (
            <div>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password!" }]}
              >
                <Input.Password />
              </Form.Item>
            </div>
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

export default Users;

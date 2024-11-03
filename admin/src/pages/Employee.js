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
  DatePicker,
} from "antd";
import moment from "moment";
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
      form.setFieldsValue({
        email: currentEmployees.email,
        name: currentEmployees.name,
        address: currentEmployees.address,
        phonenumber: currentEmployees.phonenumber,
        entryDate: currentEmployees.entryDate ? moment(currentEmployees.entryDate) : null,
        basicSalary: currentEmployees.basicSalary,
        position: currentEmployees.position,
      });
    } else {
      form.resetFields();
    }
  }, [currentEmployees, isEditMode, form]);

  const filteredData = employee.filter((employee) =>
    Object.values(employee).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
    setIsEditMode(false);
    setCurrentEmployees(null);
  };

  const handleOk = async (values) => {
    const { email,
            name,
            address,
            phonenumber,
            entryDate,
            basicSalary,
            position, 
            status,
          } = values;

    try {
      const response = isEditMode
        ? await fetch(
            `http://localhost:3001/employee/update-employee/${currentEmployees._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                email,
                name,
                address,
                phonenumber,
                entryDate,
                basicSalary,
                position,
                status,
              }),
            }
          )
        : await fetch("http://localhost:3001/employee/create-employee", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              name,
              address,
              phonenumber,
              entryDate,
              basicSalary,
              position,
            }),
          });

      if (response.ok) {
        message.success(
          `Employee ${isEditMode ? "updated" : "created"} successfully!`
        );
        fetchData(); 
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save employee."}`);
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      message.error("Failed to save employee.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if(!isEditMode){
      form.resetFields();
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployees(employee);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue(employee)
  };

  // const handleDelete =  (id) => {
  //   Modal.confirm({
  //     title: "Bạn có chắc muốn xóa sản phẩm này?",
  //     content: "Thao tác này sẽ không thể hoàn tác và mất toàn bộ dữ liệu về nhân viên.",
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk: async() => {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:3001/employee/delete-employee/${id}`,
  //           {
  //             method: "DELETE",
  //           }
  //         );
  //         if (response.ok) {
  //           message.success("employee deleted successfully!");
  //           fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
  //         } else {
  //           const errorData = await response.json();
  //           message.error(
  //             `Error: ${errorData.message || "Failed to delete employee."}`
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Error deleting employee:", error);
  //         message.error("Failed to delete employee.");
  //       }
  //     }
  //   })
  // }

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search employees"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Create New Employee
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
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: "Phone number",
            dataIndex: "phonenumber",
          },
          {
            title: "Entry Date",
            dataIndex: "entryDate",
            render: (text) => text ? moment(text).format("YYYY-MM-DD") : "",
          },
          {
            title: "Position",
            dataIndex: "position",
            render: (value, record) => 
              record.position.charAt(0).toUpperCase() + record.position.slice(1).toLowerCase()
          },
          {
            title: "Status",
            dataIndex: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => {
              const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
              return (
                <Badge
                  color={status === "working" ? "green" : "red"}
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
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditMode ? "Edit Employee" : "Create New Employee"}
        open={isModalVisible}
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
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input/>
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter first address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter last phone number!" }]}
          >
            <Input />
          </Form.Item>
          {isEditMode && (
            <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select>
                <Option value="working">Working</Option>
                <Option value="quit">Quit</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
              name="entryDate"
              label="Entry Date"
              rules={[
                { required: true, message: "Please enter the entry date!" },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select Entry Date"
              />
            </Form.Item>
          <Form.Item
            name="basicSalary"
            label="Basic Salary"
            rules={[{ required: true, message: "Please enter last phone Basic Salary!" }]}
          >
            <Select placeholder="Select basic salary">
              <Option value="23000"> 23.000 VNĐ/h </Option>
              <Option value="30000"> 30.000 VNĐ/h </Option>
            </Select>
          </Form.Item>
          {!isEditMode && (
            <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Please select a status!" }]}
            >
              <Select placeholder="Select status">
                <Option value="parking attendant">Parking attendant</Option>
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

export default Employee;

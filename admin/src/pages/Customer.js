import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Row,
  Col,
  message,
} from "antd";

const Customer = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [form] = Form.useForm();

  // const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); 
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  // Hàm lấy danh sách người dùng từ API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/customer/get-customer");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customer:", error);
      message.error("Failed to fetch customer.");
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  useEffect(() => {
    if (isEditMode && currentCustomer) {
      form.setFieldsValue(currentCustomer);
    } else {
      form.resetFields();
    }
  }, [currentCustomer, isEditMode, form]);

  const filteredData = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );


  console.log(customers)
  // const showDetailModal = (product) => {
  //   setSelectedCustomer(product);
  //   setIsDetailModalVisible(true);
  // };

  const handleOk = async (values) => {
    const { name, phonenumber } = values;

    try {
      const response = isEditMode
        ? await fetch(
          `http://localhost:3001/customer/update-customer/${currentCustomer._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phonenumber }),
          }
        )
        : await fetch("http://localhost:3001/customer/create-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phonenumber,
          }),
        });
      if (response.ok) {
        message.success(
          `Customer ${isEditMode ? "updated" : "created"} successfully!`
        );
        fetchData(); // Fetch lại danh sách người dùng sau khi tạo mới hoặc cập nhật thành công
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save customer."}`);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      message.error("Failed to save customer.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (!isEditMode) {
      form.resetFields();
    }
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue(customer);
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
  //           `http://localhost:3001/customer/delete-customer/${id}`,
  //           {
  //             method: "DELETE",
  //           });
  //         if (response.ok) {
  //           message.success("Suppiler deleted successfully!");
  //           fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
  //         } else {
  //           const errorData = await response.json();
  //           message.error(
  //             `Error: ${errorData.message || "Failed to delete customer."}`
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Error deleting customer:", error);
  //         message.error("Failed to delete customer.");
  //       }
  //     }
  //   })
  // };


  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search Customers"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        {/* <Col>
          <Button type="primary" onClick={showModal}>
            Create New Customer
          </Button>
        </Col> */}
      </Row>

      <Table
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
              <span style={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>
                {text}
              </span>
            ),
          },
          {
            title: "Phone Number",
            dataIndex: "phonenumber",
            sorter: (a, b) => a.phonenumber.localeCompare(b.phonenumber),
          },
          {
            title: "Point",
            dataIndex: "point",
            sorter: (a, b) => a.point.localeCompare(b.point),
          },
          {
            title: "Discount",
            dataIndex: "LoyaltyDicountId discount",
            render: (text, record) => ( !record.LoyaltyDicountId ? '0%' : `${record.LoyaltyDicountId.discount}%` )
          },
          {
            title: "Actions",
            render: (text, record) => (
              <div>
                {/* <Button onClick={() => showDetailModal(record)} type="link">
                    Detail
                </Button> */}
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
      {/* modal seen detail */}
      {/* <Modal
        title="Product Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedCustomer && (
          <div>
            <p><strong>Name:</strong> {selectedCustomer.name}</p>
            <p><strong>Phone number:</strong> {selectedCustomer.phonenumber}</p>
          </div>
        )}
      </Modal> */}
      {/* modal add/edit */}
      <Modal
        title={isEditMode ? "Edit Customer" : "Create New Customer"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter first number phone" }]}
          >
            <Input />
          </Form.Item>
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

export default Customer;

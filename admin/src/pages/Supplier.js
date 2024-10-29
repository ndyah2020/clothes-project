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

const Supplier = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [suppliers, setsuppliers] = useState([]);
  const [form] = Form.useForm();

  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); 
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  // Hàm lấy danh sách người dùng từ API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/supplier/get-supplier");
      const data = await response.json();
      setsuppliers(data);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      message.error("Failed to fetch supplier.");
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm fetchData khi component được mount
  }, []);

  useEffect(() => {
    if (isEditMode && currentSupplier) {
      form.setFieldsValue(currentSupplier);
    } else {
      form.resetFields();
    }
  }, [currentSupplier, isEditMode, form]);

  const filteredData = suppliers.filter((supplier) =>
    Object.values(supplier).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const showModal = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    setCurrentSupplier(null);
    form.resetFields()
  };

  const showDetailModal = (product) => {
    setSelectedSupplier(product);
    setIsDetailModalVisible(true);
  };

  const handleOk = async (values) => {
    const { name, phonenumber, address, email } = values;

    try {
      const response = isEditMode
        ? await fetch(
            `http://localhost:3001/supplier/update-supplier/${currentSupplier._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, phonenumber, address, email }),
            }
          )
        : await fetch("http://localhost:3001/supplier/create-supplier", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name, 
              phonenumber, 
              address, 
              email
            }),
          });

      if (response.ok) {
        message.success(
          `Supplier ${isEditMode ? "updated" : "created"} successfully!`
        );
        fetchData(); // Fetch lại danh sách người dùng sau khi tạo mới hoặc cập nhật thành công
        setIsModalVisible(false);
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message || "Failed to save supplier."}`);
      }
    } catch (error) {
      console.error("Error saving supplier:", error);
      message.error("Failed to save supplier.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if(!isEditMode){
      form.resetFields();
    }
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
        title: "Bạn có chắc muốn xóa người dùng này?",
        content: "Thao tác này sẽ không thể hoàn tác.",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
    onOk: async () => {
        try {
            const response = await fetch(
              `http://localhost:3001/supplier/delete-supplier/${id}`,
              {
                method: "DELETE",
              });
            if (response.ok) {
              message.success("Suppiler deleted successfully!");
              fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
            } else {
              const errorData = await response.json();
              message.error(
                `Error: ${errorData.message || "Failed to delete supplier."}`
              );
            }
          } catch (error) {
            console.error("Error deleting supplier:", error);
            message.error("Failed to delete supplier.");
        }}})
  };
  
  
  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search Suppliers"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={showModal}>
            Create New Supplier
          </Button>
        </Col>
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
            title: "Address",
            dataIndex: "address",
            sorter: (a, b) => a.address.localeCompare(b.address),
            render: (text) => (
              <span style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>
                {text}
              </span>
            ),
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: "Actions",
            render: (text, record) => (
              <div>
                <Button onClick={() => showDetailModal(record)} type="link">
                    Detail
                </Button>
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
        {selectedSupplier && (
          <div>
            <p><strong>Email:</strong> {selectedSupplier.email}</p>
            <p><strong>Name:</strong> {selectedSupplier.name}</p>
            <p><strong>Phone number:</strong> {selectedSupplier.phonenumber}</p>
            <p><strong>Address:</strong> {selectedSupplier.address}</p>
          </div>
        )}
      </Modal>

{/* modal add/edit */}
      <Modal
        title={isEditMode ? "Edit Supplier" : "Create New Supplier"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please select a email!" }]}
          >
            <Input/>
          </Form.Item>

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

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter Address!" }]}
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

export default Supplier;

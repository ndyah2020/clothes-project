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
  Select,
  Badge,
  InputNumber,
} from "antd";
const { Option } = Select;

const LoyaltyDiscount = () => {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentLoyaltyDiscount, setCurrentLoyaltyDiscount] = useState(null);
    const [loyaltyDiscounts, setLoyaltyDiscounts] = useState([]);
    const [monetaryNormData, setMonetaryNormData] = useState({})
    const [monetaryNorm, setMonetaryNorm] = useState("")
    const [form] = Form.useForm();
    
    
    const fetchData = async () => {
        try{
            const response = await fetch("http://localhost:3001/loyalty-discount/get-loyalty-discount");
            const data = await response.json();
            setLoyaltyDiscounts(data)
        }catch (error) {
            console.error("Error fetching loytalty discount:", error);
            message.error("Failed to fetch loytalty discount.");
        }
    }
    const fetchMonetaryNorm = async () => {
      try {
          const response = await fetch("http://localhost:3001/loyalty-discount/get-monetary-norm");
          const data = await response.json();
          setMonetaryNormData(data.data);
      } catch (error) {
          console.error("Error fetching monetarynorm:", error);
          message.error("Failed to fetch monetarynorm. Please try again later.");
      };
    }


    useEffect(() => {
      fetchData();
      fetchMonetaryNorm();
    }, []);
    
    useEffect(() => {
      if (isEditMode && currentLoyaltyDiscount) {
        form.setFieldsValue(currentLoyaltyDiscount);
      } else {
        form.resetFields();
      }
    }, [currentLoyaltyDiscount, isEditMode, form]);
    
    const filteredData = loyaltyDiscounts.filter((loyaltyDiscount) =>
      Object.values(loyaltyDiscount).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    
    const showModal = () => {
      form.resetFields()
      setIsModalVisible(true);
      setIsEditMode(false);
      setCurrentLoyaltyDiscount(null);
    };
    
    const handleUpdateMonetaryNorm = async () => {
      console.log(monetaryNormData._id)
      try {
          const response = await fetch(
              `http://localhost:3001/loyalty-discount/update-monetary-norm/${monetaryNormData._id}`,
              {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ moneyPerPoint: monetaryNorm }),
              }
          );

          if (!response.ok) {
              message.success(response.data.message);
          }
          fetchMonetaryNorm()
          const updatedData = await response.json();
          console.log("Monetary norm updated successfully:", updatedData);
          message.success("Monetary norm updated successfully.");
      } catch (error) {
          console.error("Error updating monetary norm:", error);
          message.error("Failed to update monetary norm. Please try again.");
      }
  };
  
    
    const handleOk = async (values) => {
      const { name, requiredPoints, discount, status} = values;
      try {
        const response = isEditMode
          ? await fetch(
              `http://localhost:3001/loyalty-discount/update-loyalty-discount/${currentLoyaltyDiscount._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, requiredPoints, discount, status}),
              }
            )
          : await fetch("http://localhost:3001/loyalty-discount/create-loyalty-discount", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name, 
                requiredPoints, 
                discount, 
              }),
            });
        if (response.ok) {
          message.success(
            `Loyalty Discount ${isEditMode ? "updated" : "created"} successfully!`
          );
          fetchData(); // Fetch lại danh sách người dùng sau khi tạo mới hoặc cập nhật thành công
          setIsModalVisible(false);
        } else {
          const errorData = await response.json();
          message.error(`Error: ${errorData.message || "Failed to save loyalty discount."}`);
        }
      } catch (error) {
        console.error("Error saving loyalty discount:", error);
        message.error("Failed to save loyalty discount.");
      }
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
      if(!isEditMode){
        form.resetFields();
      }
    };
    
    const handleEdit = (loyaltyDiscount) => {
      setCurrentLoyaltyDiscount(loyaltyDiscount);
      setIsEditMode(true);
      setIsModalVisible(true);
      form.setFieldsValue(loyaltyDiscount);
    };
    
    // const handleDelete = (id) => {
    //   Modal.confirm({
    //       title: "Bạn có chắc muốn xóa người dùng này?",
    //       content: "Thao tác này sẽ không thể hoàn tác.",
    //       okText: "Xóa",
    //       okType: "danger",
    //       cancelText: "Hủy",
    //   onOk: async () => {
    //       try {
    //           const response = await fetch(
    //             `http://localhost:3001/loyalty-discount/delete-loyalty-discount/${id}`,
    //             {
    //               method: "DELETE",
    //             });
    //           if (response.ok) {
    //             message.success("Suppiler deleted successfully!");
    //             fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
    //           } else {
    //             const errorData = await response.json();
    //             message.error(
    //               `Error: ${errorData.message || "Failed to delete loyalty discount."}`
    //             );
    //           }
    //         } catch (error) {
    //           console.error("Error deleting loyalty discount:", error);
    //           message.error("Failed to delete loyalty discount.");
    //       }}})
    // };
    
    
    return (
      <div>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Search loyalty discounts"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              onClick={handleUpdateMonetaryNorm} 
              style={{marginLeft: 450, marginRight: 4}}>
              Change Money Per Point
            </Button>
            Monetary Norm:
            <InputNumber
              onChange={(value) => setMonetaryNorm(value)}
              style={{marginLeft: 8, padding: 4}}
              value={monetaryNormData.moneyPerPoint}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={showModal} st>
              Create New Loyalty Discount
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
                title: "Required Points",
                dataIndex: "requiredPoints",
                sorter: (a, b) => a.requiredPoints - b.requiredPoints            
            },
            {
              title: "Discount",
              dataIndex: "discount",
              sorter: (a, b) => a.discount - b.discount,
              render: (data, record) => record.discount + `%`
            },
            {
                title: "Status",
                dataIndex: "status",
                sorter: (a, b) => a.status.localeCompare(b.status),
                render: (status, record) => (
                  <div>
                    <Badge
                      color={
                        status === "active" ? "green" : 
                        status === "paused" ? "red" : "white"
                      }
                      style={{ marginRight: 8 }} 
                    />
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
                  </div>
                )
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
            }
          ]}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
        />
        <Modal
          title={isEditMode ? "Edit Loyalty Discount" : "Create New Loyalty Discount"}
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
              name="requiredPoints"
              label="Required Poits"
              rules={[{ required: true, message: "Please enter first number requiredPoints" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount"
              rules={[{ required: true, message: "Please enter first discount" }]}
            >
              <Input />
            </Form.Item>
            {isEditMode && (
              <Form.Item
                name='status'
                label='Status'
              >
                <Select>
                  <Option value='active'>Active</Option>
                  <Option value='paused'>Paused</Option>
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

export default LoyaltyDiscount;

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
  DatePicker,
  Badge,
} from "antd"

import moment from "moment";
const Promotion = () => {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [form] = Form.useForm();
    

    const fetchData = async () => {
        try{
            const response = await fetch("http://localhost:3001/promotion/get-promotion");
            const data = await response.json();
            setPromotions(data)
        }catch (error) {
            console.error("Error fetching promotion:", error);
            message.error("Failed to fetch promotion.");
        }
    }

    useEffect(() => {
      fetchData(); // Gọi hàm fetchData khi component được mount
    }, []);
    
    useEffect(() => {
      if (isEditMode && currentPromotion) {
        form.setFieldsValue({
          name: currentPromotion.name,
          startTime: currentPromotion.startTime ? moment(currentPromotion.startTime) : null,
          endTime: currentPromotion.endTime ? moment(currentPromotion.endTime) : null,
          discount: currentPromotion.discount,
        });
      } else {
        form.resetFields();
      }
    }, [currentPromotion, isEditMode, form]);
    
    const filteredData = promotions.filter((Promotion) =>
      Object.values(Promotion).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    
    const showModal = () => {
      form.resetFields()
      setIsModalVisible(true);
      setIsEditMode(false);
      setCurrentPromotion(null);
    };
    
    
    const handleOk = async (values) => {
      const { name, startTime, endTime, discount} = values;
      try {
        const response = isEditMode
          ? await fetch(
              `http://localhost:3001/promotion/update-promotion/${currentPromotion._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, startTime, endTime, discount}),
              }
            )
          : await fetch("http://localhost:3001/promotion/create-promotion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name, 
                startTime,
                endTime,
                discount, 
              }),
          });

        if (response.ok) {
          message.success(
            `Promotion ${isEditMode ? "updated" : "created"} successfully!`
          );
          fetchData();
          setIsModalVisible(false);
        } else {
        const errorData = await response.json();
            message.error(`Error: ${errorData.message || "Failed to save promotion."}`);
        }
      } catch (error) {
        console.error("Error saving promotion:", error);
        message.error("Failed to save promotion.");
      }
    };
    
    const handleCancel = () => {
      setIsModalVisible(false);
      if(!isEditMode){
        form.resetFields();
      }
    };
    
    const handleEdit = (promotion) => {
      setCurrentPromotion({
        ...promotion,
        startTime: promotion.startTime ? moment(promotion.startTime) : null,
        endTime: promotion.endTime ? moment(promotion.endTime) : null,
      });
      setIsEditMode(true);
      setIsModalVisible(true);
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
    //             `http://localhost:3001/promotion/delete-promotion/${id}`,
    //             {
    //               method: "DELETE",
    //             });
    //           if (response.ok) {
    //             message.success("Suppiler deleted successfully!");
    //             fetchData(); // Fetch lại danh sách người dùng sau khi xóa thành công
    //           } else {
    //             const errorData = await response.json();
    //             message.error(
    //               `Error: ${errorData.message || "Failed to delete promotion."}`
    //             );
    //           }
    //         } catch (error) {
    //           console.error("Error deleting promotion:", error);
    //           message.error("Failed to delete promotion.");
    //       }}})
    // };
    
    return (
      <div>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Search promotions"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={showModal}>
              Create New Promotion
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
              title: "Start Time",
              dataIndex: "startTime",
              render: (data) => data ? moment(data).format("YYYY-MM-DD") : "",
            },
            {
              title: "End Time",
              dataIndex: "endTime",
              render: (data) => data ? moment(data).format("YYYY-MM-DD") : "",
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
              render: status => {
                return(
                  <Badge
                  color={
                    status === "Active" ? "green" : 
                    status === "Not Applied" ? "orange" : 
                    status === "Expired" ? "red" : "white"
                  }
                  text={status}
                  style={{ marginRight: 8 }} 
              />
                ) 
              }
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
          title={isEditMode ? "Edit Promotion" : "Create New Promotion"}
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
              name="startTime"
              label="Start Time"
              rules={[{ required: true, message: "Please enter first start time" }]}
            >
               <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select start time"
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ required: true, message: "Please enter first end time" }]}
            >
               <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select end time"
              />
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount"
              rules={[{ required: true, message: "Please enter first discount" }]}
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

export default Promotion;

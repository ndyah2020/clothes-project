import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Table,
    Input,
    Button,
    Modal,
    Row,
    Col,
    message,
    Badge,
    Card,
    Tooltip,
} from "antd";
import moment from "moment";

const ImportNoteList = () => {
    const [searchText, setSearchText] = useState("");
    const [importNoteList, setImportNoteList] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [currentDetails, setCurrentDetails] = useState([]);
    const [selectedImportNote, setSelectedImportNote] = useState("")
    const history = useHistory();
    // Hàm lấy danh sách hóa đơn từ API
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3001/import-note/get-import-note");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();


            const formattedData = data.map((importNote) => ({
                key: importNote._id,

                supplierName: importNote.supplierId?.name || "N/A",
                phoneNumber: importNote.supplierId?.phonenumber || "N/A",
                email: importNote.supplierId?.email || "N/A",

                noteCode: importNote.noteCode,
                employeeName: importNote.createdBy
                    ? `${importNote.createdBy.firstName} ${importNote.createdBy.lastName}`
                    : "N/A",
                employeeEmail: importNote.createdBy?.email || "N/A",

                status: importNote.status || "N/A",
                totalAmount: importNote.totalAmount,
                importNoteDetail: importNote.importNoteDetail.map((detail) => ({
                    importNoteDetailId: detail._id,
                    productName: detail.productId?.name || "Unknown",
                    productSku: detail.productId?.sku || "N/A",
                    size: detail.size,
                    quantity: detail.quantity,
                    price: detail.price,
                    total: detail.total,
                })),
                createdAt: moment(importNote.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            }));

            setImportNoteList(formattedData);
        } catch (error) {
            console.error("Error fetching import notes:", error);
            message.error("Failed to fetch import notes.");
        }
    };




    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = importNoteList.filter((importNote) =>
        Object.values(importNote).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const showDetailsModal = (details) => {
        setCurrentDetails(details);
        setDetailsModalVisible(true);
    };


    const supplierInfor = selectedImportNote && importNoteList.length > 0
        ? (() => {
            const selectedImportNoteData = importNoteList.find((importNote) => importNote.key === selectedImportNote);
            return selectedImportNoteData
                ? {
                    name: selectedImportNoteData.supplierName || "Unknown",
                    phoneNumber: selectedImportNoteData.phoneNumber || "N/A",
                    email: selectedImportNoteData.shippingAddress || "N/A",
                }
                : {
                    name: "Unknown",
                    phoneNumber: "N/A",
                    shippingAddress: "N/A",
                };
        })()
        : {
            name: "Unknown",
            phoneNumber: "N/A",
            shippingAddress: "N/A",
        };

    const employeeInfor = selectedImportNote && importNoteList.length > 0
        ? (() => {
            const selectedImportNoteData = importNoteList.find((importNote) => importNote.key === selectedImportNote);
            return selectedImportNoteData
                ? {
                    name: selectedImportNoteData.employeeName || "Unknown",
                    email: selectedImportNoteData.employeeEmail || "N/A",
                }
                : {
                    name: "Unknown",
                    email: "N/A",

                };
        })()
        : {
            name: "Unknown",
            email: "N/A",

        };
        
    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Search importNote"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>

            <Table
                columns={[
                    {
                        title: "Supplier",
                        dataIndex: "supplierName",
                        key: "supplierName",
                        ellipsis: true,
                        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                    },
                    {
                        title: "Note Code",
                        dataIndex: "noteCode",
                        key: "noteCode",
                        render: (text, record) => (
                            <Button
                                type="link"
                                style={{ fontSize: 14 }}
                                onClick={() => history.push(`/import-note-check/${record.key}`)} 
                            >
                                {text}
                            </Button>
                        ),
                    },
                    {
                        title: "Employee Name",
                        dataIndex: "employeeName",
                        key: "employeeName",
                    },
                    {
                        title: "Total Price",
                        dataIndex: "totalAmount",
                        key: "totalAmount",
                        render: (price) => `${price.toLocaleString()} VND`,
                    },
                    {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => (
                            <Badge
                                color={
                                    status === "Completed"
                                        ? "green"
                                        : status === "Pending"
                                            ? "orange"
                                            : "red"
                                }
                                text={status}
                            />
                        ),
                    },
                    {
                        title: "Created At",
                        dataIndex: "createdAt",
                        key: "createdAt",
                    },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (text, record) => (
                            <Button
                                onClick={() => {
                                    setSelectedImportNote(record.key);
                                    showDetailsModal(record.importNoteDetail);
                                }}
                            >
                                View Details
                            </Button>
                        ),
                    },
                ]}
                dataSource={filteredData}
                pagination={{ pageSize: 6 }}
            />
            <Modal
                title="ImportNote Details"
                visible={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                width={900}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                    {employeeInfor && (
                        <Col span={12}>
                            <Card
                                title="ImportNote Creator"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Name:</strong> {employeeInfor.name}</p>
                                <p><strong>Email:</strong> {employeeInfor.email}</p>
                            </Card>
                        </Col>
                    )}
                    {supplierInfor && (
                        <Col span={12}>
                            <Card
                                title="Customer"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Name:</strong> {supplierInfor.name}</p>
                                <p><strong>Phone Number:</strong> {supplierInfor.phoneNumber}</p>
                                <p><strong>Email</strong> {supplierInfor.email}</p>
                            </Card>
                        </Col>
                    )}
                </Row>


                <Table
                    columns={[
                        {
                            title: "Product Name",
                            dataIndex: "productName",
                            key: "productName",
                        },
                        {
                            title: "SKU",
                            dataIndex: "productSku",
                            key: "productSku",
                        },
                        {
                            title: "Size",
                            dataIndex: "size",
                            key: "size",
                        },
                        {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Unit Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => `${price.toLocaleString()} VND`,
                        },
                        {
                            title: "Total Price",
                            dataIndex: "total",
                            key: "total",
                            render: (price) => `${price.toLocaleString()} VND`,
                        },
                    ]}
                    dataSource={currentDetails.map((detail, index) => ({
                        key: index,
                        ...detail,
                    }))}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    summary={() => {
                        const totalAmount = currentDetails.reduce((sum, product) => {
                            return sum += product.price * product.quantity
                        }, 0)

                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={5} style={{ textAlign: "right" }}>
                                        <strong>Total Amount:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <strong>{totalAmount.toLocaleString()} VND</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}

                />
            </Modal>

        </div>
    );
};

export default ImportNoteList;

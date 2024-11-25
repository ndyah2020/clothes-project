import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Table,
    Button,
    Row,
    Col,
    message,
    Badge,
    Card,
    InputNumber,
    Modal,
} from "antd";
import axios from "axios";
import moment from "moment";


const ImportNoteListCheck = () => {
    const { id } = useParams()
    const [importNote, setImportNote] = useState({});
    const [pressReceivedQuantity, setPressReceivedQuantity] = useState([])
    // Lấy hóa đơn từ params
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/import-note/get-import-note-by-id/${id}`);
            const importNoteData = response.data;

            const formattedData = {
                key: importNoteData._id,

                supplierName: importNoteData.supplierId?.name || "N/A",
                phoneNumber: importNoteData.supplierId?.phonenumber || "N/A",
                supplierEmail: importNoteData.supplierId?.email || "N/A",

                noteCode: importNoteData.noteCode,
                employeeName: importNoteData.createdBy
                    ? `${importNoteData.createdBy.firstName} ${importNoteData.createdBy.lastName}`
                    : "N/A",
                employeeEmail: importNoteData.createdBy?.email || "N/A",
                status: importNoteData.status || "N/A",
                totalAmount: importNoteData.totalAmount,
                importNoteDetail: importNoteData.importNoteDetail?.map((detail) => ({
                    key: detail._id,

                    productId: detail.productId?._id || "N/A",
                    productName: detail.productId?.name || "Unknown",
                    productSku: detail.productId?.sku || "N/A",

                    size: detail.size,
                    quantity: detail.quantity,
                    price: detail.price,
                    total: detail.total,
                })) || [],
                createdAt: moment(importNoteData.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            };

            setImportNote(formattedData);
        } catch (error) {
            console.error("Error fetching import note:", error);
            message.error("Failed to fetch import note.");
        }
    };

    const confirmCompleteImportNote = (callback) => {
        Modal.confirm({
            title: "Are you sure you want to complete this action?",
            content: "This action cannot be undone.",
            okText: "Complete",
            okType: "primary",
            cancelText: "Cancel",
            onOk: async () => {
                const isCompleted = await handleUpdateStatus();
                if (isCompleted && callback) {
                    callback();
                }
            },
        });
    };



    const handleUpdateStatus = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:3001/import-note/update-status-import-note/${id}`,
            );
            if (response.status === 200) {
                message.success(response.data.message);
                fetchData();
                return true; 
            } else {
                message.error(response.data.message);
                return false; 
            }
        } catch (error) {
            console.error('Error completing import note:', error);
            message.error('Failed to complete the import note. Please try again.');
            return false;
        }
    }

    const handleUpdateQuantityProduct= async () => {
        if (pressReceivedQuantity.length === 0) {
            message.error('Please enter the full quantity to be received');
            return;
        } else {
            const invalidItem = pressReceivedQuantity.importNoteDetail.some(item => {
                return item.receivedQuantity < 0 || item.receivedQuantity === undefined;
            });
        
            if (invalidItem) {
                message.error('Please enter the full quantity to be received');
                return;
            }
        }
        confirmCompleteImportNote( async () => {
            try {
                const response = await axios.patch(
                    `http://localhost:3001/product/update-quatity-by-import-note`,
                    {importNoteQuantity: pressReceivedQuantity.importNoteDetail}
                );
                if (response.status === 200) {
                    message.success(response.data.message);
                    fetchData();
                    return true; 
                } else {
                    message.error(response.data.message);
                    return false; 
                }
            } catch (error) {
                console.error('Error updating  quantity:', error);
                message.error('Failed to updating the import note. Please try again.');
                return false;
            }
        })
    }


    const handleCancelImportNote = async () => {
        try {
            const response = await axios.patch(`http://localhost:3001/import-note/cancel-status-import-note/${id}`);
    
            if (response.status === 200) {
                message.success(response.data.message);
                fetchData();
                return true; 
            } else {
                message.error(response.data.message);
                return false; 
            }
        } catch (error) {
            console.error('Error cancelling import note:', error);
            message.error('Failed to cancel the import note. Please try again.');
            return false;
        }
    };


    useEffect(() => {
        fetchData();
    }, [id]);


    const supplierInfor = importNote
        ? (() => {
            return importNote
                ? {
                    name: importNote.supplierName || "Unknown",
                    phoneNumber: importNote.phoneNumber || "N/A",
                    email: importNote.supplierEmail || "N/A",
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

    const employeeInfor = importNote
        ? (() => {
            return importNote
                ? {
                    name: importNote.employeeName || "Unknown",
                    email: importNote.employeeEmail || "N/A",
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

    const createObjToUpdate = (value, record, index) => {
        if (value > record.quantity) {
            message.error("Cannot exceed 6 digits.");
        }
        const updatedDetails = [...importNote.importNoteDetail];
        updatedDetails[index].receivedQuantity = value || 0;
        setPressReceivedQuantity((prev) => ({
            ...prev,
            importNoteDetail: updatedDetails,
        }));
    }


    return (
        <div>
            <Row style={{ marginBottom: 20, display: "flex", justifyContent: "right" }}>
                {importNote &&
                    (() => {
                        if (importNote.status === 'Pending') {
                            return (
                                <>
                                    <Button
                                        type="danger"
                                        style={{ margin: "0 8px" }}
                                        onClick={() => handleCancelImportNote()}
                                    >
                                        Cancel ImportNote
                                    </Button>

                                    <Button
                                        type="primary"
                                        style={{ margin: "0 8px" }}
                                        onClick={() => {
                                            handleUpdateQuantityProduct()
                                        }}
                                    >
                                        Complete ImportNote
                                    </Button>
                                </>
                            );
                        }
                        return null;
                    })()
                }
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                {employeeInfor && (
                    <>
                        <Col span={12}>
                            <Card
                                title="Information Creator And Status"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Name:</strong> {employeeInfor.name}</p>
                                <p><strong>Email:</strong> {employeeInfor.email}</p>


                                <h4>ImportNote Status </h4>
                                <Badge
                                    text={`${importNote.status}`}

                                    color={
                                        importNote.status === "Completed"
                                            ? "green"
                                            : importNote.status === "Pending"
                                                ? "orange"
                                                : "red"
                                    }
                                />

                            </Card>
                        </Col>
                    </>
                )}
                {supplierInfor && (
                    <Col span={12}>
                        <Card
                            title="Information Supplier"
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
                        title: "Delivered Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                    },
                    {
                        title: "Received Quantity",
                        key: 'receivedQuantity',
                        render: (text, record, index) => (
                            <InputNumber
                                min={0}
                                max={record.quantity}
                                formatter={(value) => value?.replace(/\D/g, "")}
                                parser={(value) => value.replace(/\D/g, "")}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}

                                onChange={(value) => {
                                    createObjToUpdate(value, record, index)
                                }}
                                disabled={importNote.status !== 'Pending'}
                            />
                        ),
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
                dataSource={importNote.importNoteDetail}
                pagination={false}
                scroll={{ x: "max-content" }}
                summary={() => {
                    const totalAmount = importNote.importNoteDetail?.reduce((sum, product) => {
                        return sum + product.total;
                    }, 0) || 0;
                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={6} style={{ textAlign: "right" }}>
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
        </div>
    );
};

export default ImportNoteListCheck;

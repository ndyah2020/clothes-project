import React, { useState, useEffect } from "react";
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
} from "antd";
import moment from "moment";

const InvoiceList = () => {
    const [searchText, setSearchText] = useState("");
    const [invoiceList, setinvoiceList] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [currentDetails, setCurrentDetails] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(-1)


    // Hàm lấy danh sách hóa đơn từ API
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3001/invoice/get-invoice");
            const data = await response.json();
            const formattedData = data.map((invoice) => ({
                key: invoice._id,

                customer: invoice.customer?.name || "Unknown",
                phoneNumber: invoice.customer?.phonenumber || "N/A",
                pointCustomer: invoice.customer?.point || 0,
                discount: invoice.discount,

                employeeName: invoice.employee?.name || 'Admin',
                employeeEmail: invoice.employee?.email || "Admin",
                employeePhone: invoice.employee?.phoneNumber || "N/A",
                employeeAddress: invoice.employee?.address || "N/A",

                orderType: invoice.orderType,
                shippingAddress: invoice?.shippingAddress || "N/A",
                shippingFee: invoice.shippingFee,

                promoCode: invoice.promoCode?.name || "N/A",
                promoDiscout: invoice.promoCode?.discount || 0,
                promoStartTime: invoice.promoCode?.startTime || null,
                promoEndTime: invoice.promoCode?.endTime || null,

                
                totalPrice: invoice.totalPrice,
                status: invoice.status,
                invoiceDetails: invoice.invoiceDetails.map((detail) => ({
                    product: detail.product?.name || "Unknown",
                    sku: detail.product?.sku || "N/A",
                    selectedSize: detail.selectedSize,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                })),
                createdAt: moment(invoice.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            }));
            setinvoiceList(formattedData);
        } catch (error) {
            console.error("Error fetching invoice:", error);
            message.error("Failed to fetch invoice.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = invoiceList.filter((invoice) =>
        Object.values(invoice).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const showDetailsModal = (details) => {
        setCurrentDetails(details);
        setDetailsModalVisible(true);
    };

    const calculateGrandTotal = (details) => {
        return details.reduce((sum, item) => sum + item.unitPrice, 0);
    };

    const customerInfor = selectedInvoice && invoiceList.length > 0
        ? (() => {
            const selectedInvoiceData = invoiceList.find((invoice) => invoice.key === selectedInvoice);
            return selectedInvoiceData
                ? {
                    name: selectedInvoiceData.customer || "Unknown",
                    discount: selectedInvoiceData.discount || 0,
                    phoneNumber: selectedInvoiceData.phoneNumber || "N/A",
                    email: selectedInvoiceData.shippingAddress || "N/A",
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

    const employeeInfor = selectedInvoice && invoiceList.length > 0
        ? (() => {
            const selectedInvoiceData = invoiceList.find((invoice) => invoice.key === selectedInvoice);
            return selectedInvoiceData
                ? {
                    name: selectedInvoiceData.employeeName || "Unknown",
                    email: selectedInvoiceData.employeeEmail || "N/A",
                    phoneNumber: selectedInvoiceData.employeePhone || "N/A",
                    address: selectedInvoiceData.employeeAddress || "N/A",
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

    const PromoInFor = selectedInvoice && invoiceList.length > 0
        ? (() => {
            const selectedInvoiceData = invoiceList.find((invoice) => invoice.key === selectedInvoice);
            return selectedInvoiceData
                ? {
                    promoCode: selectedInvoiceData.promoCode || "Unknown",
                    discount: selectedInvoiceData.promoDiscout || "N/A",
                    startTime: selectedInvoiceData.promoStartTime
                        ? moment(selectedInvoiceData.promoStartTime).format("YYYY-MM-DD")
                        : "N/A",
                    endTime: selectedInvoiceData.promoEndTime
                        ? moment(selectedInvoiceData.promoEndTime).format("YYYY-MM-DD")
                        : "N/A",
                }
                : {
                    promoCode: "Unknown",
                    discount: "N/A",
                    startTime: "N/A",
                    endTime: "N/A",
                };
        })()
        : {
            promoCode: "Unknown",
            discount: "N/A",
            startTime: "N/A",
            endTime: "N/A",
        };



    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Input
                        placeholder="Search invoice"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>

            <Table
                columns={[
                    {
                        title: "Customer",
                        dataIndex: "customer",
                        key: "customer",
                    },
                    {
                        title: "Order Type",
                        dataIndex: "orderType",
                        key: "orderType",
                        render: (type) => (
                            <Badge
                                color={type === "online" ? "blue" : "green"}
                                text={type.charAt(0).toUpperCase() + type.slice(1)}
                            />
                        ),
                    },
                    {
                        title: "Promo Code",
                        dataIndex: "promoCode",
                        key: "discount",
                    },
                    {
                        title: "Total Price",
                        dataIndex: "totalPrice",
                        key: "totalPrice",
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
                        render: (text, record, index) => (
                            <div>
                                <Button onClick={() => {
                                    showDetailsModal(record.invoiceDetails)
                                    setSelectedInvoice(record.key);
                                }}>
                                    View Details
                                </Button>
                            </div>
                        ),
                    },
                ]}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title="Invoice Details"
                visible={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={null}
                width={900}
            >
                {console.log(invoiceList)}
                <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                    {employeeInfor && (
                        <Col span={8}>
                            <Card
                                title="Employee"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Name:</strong> {employeeInfor.name}</p>
                                <p><strong>Phone Number:</strong> {employeeInfor.phoneNumber}</p>
                                <p><strong>Email:</strong> {employeeInfor.email}</p>
                                <p><strong>Address:</strong> {employeeInfor.address}</p>
                            </Card>
                        </Col>
                    )}
                    {customerInfor && (
                        <Col span={8}>
                            <Card
                                title="Customer"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Name:</strong> {customerInfor.name}</p>
                                <p><strong>Phone Number:</strong> {customerInfor.phoneNumber}</p>
                                <p><strong>Discount:</strong> {customerInfor?.discount || 0}%</p>
                                <p><strong>Shipping Address:</strong> {customerInfor.email}</p>
                            </Card>
                        </Col>
                    )}
                    {PromoInFor && (
                        <Col span={8}>
                            <Card
                                title="Promotion"
                                bordered={false}
                                style={{
                                    height: "100%",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                }}
                            >
                                <p><strong>Code:</strong> {PromoInFor.promoCode}</p>
                                <p><strong>Discount:</strong> {PromoInFor?.discount || 0}%</p>
                                <p><strong>Start Time:</strong> {PromoInFor.startTime}</p>
                                <p><strong>End Time:</strong> {PromoInFor.endTime}</p>
                            </Card>
                        </Col>
                    )}
                </Row>


                <Table
                    columns={[
                        {
                            title: "Product Name",
                            dataIndex: "product",
                            key: "product",
                        },
                        {
                            title: "SKU",
                            dataIndex: "sku",
                            key: "sku",
                        },
                        {
                            title: "Selected Size",
                            dataIndex: "selectedSize",
                            key: "selectedSize",
                        },
                        {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Unit Price",
                            dataIndex: "unitPrice",
                            key: "unitPrice",
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
                        const selectedInvoiceData = invoiceList.find((invoice) => invoice.key === selectedInvoice);

                        if (!selectedInvoiceData) {
                            return null;
                        }

                        const grandTotal = calculateGrandTotal(currentDetails);
                        const totalPrice = selectedInvoiceData?.totalPrice || 0;
                        const shippingFee = selectedInvoiceData?.shippingFee || 0;
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={4} style={{ textAlign: "right" }}>
                                        <strong>Grand Total:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <strong>{`${grandTotal.toLocaleString()} VND`}</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={4} style={{ textAlign: "right" }}>
                                        <strong>Shipping Fee:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <strong>{`${shippingFee.toLocaleString()} VND`}</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={4} style={{ textAlign: "right" }}>
                                        <strong>Total After Discount:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <strong>{`${totalPrice.toLocaleString()} VND`}</strong>
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

export default InvoiceList;

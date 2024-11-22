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
                orderType: invoice.orderType,
                shippingAddress: invoice.shippingAddress || "N/A",
                shippingFee: invoice.shippingFee,
                promoCode: invoice.promoCode?.name || "N/A",
                promoDiscout: invoice.promoCode?.discount || 0,
                promoStartTime: invoice.promoCode?.startTime || null,
                promoEndTime: invoice.promoCode?.endTime || null,
                discount: invoice.discount,
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

    const customerInfor =
        selectedInvoice >= 0
            ? {
                name: invoiceList[selectedInvoice]?.customer || "Unknown",
                phoneNumber: invoiceList[selectedInvoice]?.phoneNumber || "N/A",
                point: invoiceList[selectedInvoice]?.pointCustomer || 0,
                shippingAddress: invoiceList[selectedInvoice]?.shippingAddress || "N/A",
            }
            : null;
    const PromoInFor =
        selectedInvoice >= 0
            ? {
                promoCode: invoiceList[selectedInvoice]?.promoCode || "Unknown",
                discount: invoiceList[selectedInvoice]?.promoDiscout || "N/A",
                startTime: invoiceList[selectedInvoice]?.promoStartTime
                    ? moment(invoiceList[selectedInvoice].promoStartTime).format("YYYY-MM-DD")
                    : "N/A",
                endTime: invoiceList[selectedInvoice]?.promoEndTime 
                    ? moment(invoiceList[selectedInvoice].promoEndTime).format("YYYY-MM-DD")
                    : "N/A",
            }
            : null;


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
                                    setSelectedInvoice(index)
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
                <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                    {customerInfor && (
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
                                <p><strong>Name:</strong> {customerInfor.name}</p>
                                <p><strong>Phone Number:</strong> {customerInfor.phoneNumber}</p>
                                <p><strong>Points:</strong> {customerInfor.point}</p>
                                <p><strong>Discount:</strong> {customerInfor?.discount || 0}%</p>
                                <p><strong>Shipping Address:</strong> {customerInfor.shippingAddress}</p>
                            </Card>
                        </Col>
                    )}
                    {PromoInFor && (
                        <Col span={12}>
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
                        const grandTotal = calculateGrandTotal(currentDetails);
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
                                        <strong>Total After Discount</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        <strong>{`${invoiceList[selectedInvoice].totalPrice.toLocaleString()} VND`}</strong>
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

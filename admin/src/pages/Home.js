import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Statistic, Table } from "antd";
import { Pie, Column } from "@ant-design/plots";
import axios from "axios";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarCircleOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  FundOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/dashboard/get-datas"
        );
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { summary, details } = dashboardData;

  // Tính tổng chi phí nhập hàng
  const totalImportCost = details.importNotes.reduce(
    (sum, note) => sum + note.totalAmount,
    0
  );

  // Tính tổng hóa đơn
  const totalOrders = details.invoices.length;

  // Tính tình trạng giao hàng
  const deliveredOrders = details.invoices.filter(
    (invoice) => invoice.status === "Delivered"
  ).length;
  const pendingOrders = details.invoices.filter(
    (invoice) => invoice.status === "Pending"
  ).length;

  // Cấu hình biểu đồ tình trạng tồn kho
  const inventoryGroupedColumnConfig = {
    data: details.products.flatMap((product) =>
      product.sizes.map((size) => ({
        name: product.name,
        size: size.size,
        quantity: size.quantity,
      }))
    ),
    isGroup: true,
    xField: "name",
    yField: "quantity",
    seriesField: "size",
    colorField: "size",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: "middle",
      style: {
        fontSize: 12,
        fontWeight: "bold",
      },
    },
    xAxis: {
      title: {
        text: "Sản Phẩm",
        style: { fontSize: 14 },
      },
    },
    yAxis: {
      title: {
        text: "Số Lượng Tồn Kho",
        style: { fontSize: 14 },
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: `Kích thước ${datum.size}`,
        value: `Tồn kho: ${datum.quantity}`,
      }),
    },
  };

  // Cấu hình bảng Top Nhân Viên Xuất Sắc
  const topEmployeesColumns = [
    { title: "Tên Nhân Viên", dataIndex: "name", key: "name" },
    {
      title: "Số Hóa Đơn",
      dataIndex: "totalInvoices",
      key: "totalInvoices",
      sorter: (a, b) => a.totalInvoices - b.totalInvoices,
    },
    {
      title: "Doanh Thu (VND)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
  ];

  // Cấu hình bảng Top Khách Hàng VIP
  const topCustomersColumns = [
    { title: "Tên Khách Hàng", dataIndex: "name", key: "name", width: "30%" },
    {
      title: "Số Điện Thoại",
      dataIndex: "phonenumber",
      key: "phone",
      width: "30%",
    },
    {
      title: "Tổng Số Lần Mua",
      dataIndex: "totalPurchases",
      key: "totalPurchases",
      width: "20%",
    },
    {
      title: "Tổng Doanh Thu (VND)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right",
      width: "20%",
      render: (value) => value.toLocaleString("vi-VN"),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "20px" }}>
      {/* Phần thông tin tổng quan */}
      <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Khách Hàng"
              value={summary.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Nhân Viên"
              value={summary.totalEmployees}
              prefix={<ClusterOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Sản Phẩm"
              value={summary.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        {/* <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Doanh Thu"
              value={summary.totalRevenue}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix="VND"
            />
          </Card>
        </Col> */}
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Hóa Đơn"
              value={totalOrders}
              prefix={<ProfileOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Phần thông tin bổ sung */}
      <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
        {/* Card Tổng Chi Phí Nhập Hàng */}
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Chi Phí Nhập Hàng"
              value={totalImportCost}
              prefix={<FundOutlined />}
              valueStyle={{ color: "#fa541c" }}
              suffix="VND"
            />
          </Card>
        </Col>

        {/* Card Tổng Hóa Đơn */}
        <Col span={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title="Tổng Doanh Thu"
              value={summary.totalRevenue}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix="VND"
            />
          </Card>
        </Col>

        {/* Card Tình Trạng Giao Hàng */}
        <Col span={12}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Title
                level={5}
                style={{ color: "#08979c", marginBottom: "8px" }}
              >
                Tình Trạng Giao Hàng
              </Title>
              <div>
                <span
                  style={{
                    color: "#3f8600",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {deliveredOrders} Đã Giao
                </span>{" "}
                /{" "}
                <span
                  style={{
                    color: "#faad14",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {pendingOrders} Chờ Xử Lý
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ và các bảng */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Top Sản Phẩm Bán Chạy">
            <Pie
              data={details.products.map((product) => ({
                name: product.name,
                value: product.sizes.reduce(
                  (total, size) => total + size.quantity,
                  0
                ),
              }))}
              angleField="value"
              colorField="name"
              radius={0.8}
              innerRadius={0.6}
              label={{
                type: "inner",
                offset: "-30%",
                content: "{value}",
                style: { fill: "#fff", fontSize: 12, fontWeight: "bold" },
              }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Chi Phí Nhập Hàng Theo Nhà Cung Cấp">
            <Pie
              data={details.importNotes.map((note) => ({
                supplier: note.supplierId.name,
                total: note.totalAmount,
              }))}
              angleField="total"
              colorField="supplier"
              radius={0.8}
              innerRadius={0.6}
              label={{
                type: "inner",
                offset: "-50%",
                content: "{value}",
                style: {
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "center",
                },
              }}
              tooltip={{
                formatter: (datum) => ({
                  name: datum.supplier,
                  value: `${datum.total} VND`,
                }),
              }}
              interactions={[
                { type: "element-selected" },
                { type: "element-active" },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Tình Trạng Tồn Kho Sản Phẩm">
            <Column {...inventoryGroupedColumnConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Danh Sách Hóa Đơn">
            <Table
              dataSource={details.invoices}
              columns={[
                {
                  title: "Khách Hàng",
                  dataIndex: "customer",
                  key: "customer",
                  render: (customer) => customer?.name || "Không xác định",
                },
                {
                  title: "Tổng Tiền",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                },
                { title: "Trạng Thái", dataIndex: "status", key: "status" },
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="TOP Nhân Viên Xuất Sắc">
            <Table
              dataSource={details.topEmployees}
              columns={topEmployeesColumns}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Danh Sách Nhà Cung Cấp">
            <Table
              dataSource={details.suppliers}
              columns={[
                { title: "Tên Nhà Cung Cấp", dataIndex: "name", key: "name" },
                {
                  title: "Tổng Cung Cấp (VND)",
                  dataIndex: "totalSupplied",
                  key: "totalSupplied",
                  align: "right",
                  render: (value) => value.toLocaleString("vi-VN"),
                },
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="TOP Khách Hàng VIP">
            <Table
              dataSource={details.vipCustomers}
              columns={[
                {
                  title: "Tên Khách Hàng",
                  dataIndex: "name",
                  key: "name",
                  width: "30%",
                },
                {
                  title: "Số Điện Thoại",
                  dataIndex: "phonenumber", // Sửa từ phoneNumber thành phonenumber
                  key: "phonenumber", // Sửa key để khớp với API
                  width: "30%",
                },
                {
                  title: "Tổng Số Lần Mua",
                  dataIndex: "totalPurchases",
                  key: "totalPurchases",
                  width: "20%",
                },
                {
                  title: "Tổng Doanh Thu (VND)",
                  dataIndex: "totalRevenue",
                  key: "totalRevenue",
                  align: "right",
                  width: "20%",
                  render: (value) => value.toLocaleString("vi-VN"),
                },
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="_id" // Đảm bảo sử dụng đúng trường ID
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

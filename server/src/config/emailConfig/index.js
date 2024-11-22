const nodemailer = require("nodemailer");

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc sử dụng một dịch vụ SMTP khác
  auth: {
    user: "ndanh24032004@gmail.com", // Email của bạn
    pass: "bqwh vlzc kypz wjcd", // Mật khẩu ứng dụng (App Password nếu dùng Gmail)
  },
});

// Hàm gửi email
async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: "ndanh24032004@gmail.com", // Email gửi đi
    to, // Email nhận
    subject,
    text, // Nội dung dạng text
    html, // Nội dung dạng HTML
  };

  // Gửi email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Ném lỗi để xử lý ở tầng cao hơn
  }
}

module.exports = { sendEmail };

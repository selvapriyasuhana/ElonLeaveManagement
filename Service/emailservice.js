const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "priyaecs95@gmail.com",
    pass: "ykbh ggzn ozmo dutz",
  },
});

exports.sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "priyaecs95@gmail.com",
    to,
    subject,
    text,
  };
  console.log("Preparing to send email...");
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error); // Log the error for detailed information
      console.error("Error response:", error.response); // Log the response message
      console.error("Error code:", error.code); // Log the error code
      /*} else {
      console.log("Email sent: " + info.response);
    }
  });
};*/
      return {
        success: false,
        message:
          "Email could not be sent. Please check the credentials and try again.",
      };
    } else {
      console.log("Email sent:", info.response);
      // Indicate success to the caller
      return {
        success: true,
        message: "Email sent successfully.",
      };
    }
  });
};

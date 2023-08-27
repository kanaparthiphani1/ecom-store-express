const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ac78bc3c7e9a5a",
      pass: "34fc53fcae4385",
    },
  });

  const info = await transporter.sendMail({
    from: "kp@gmail.com", // sender address
    to: options.toAddr, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;

import sgMail from "@sendgrid/mail";

const sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const mailOptions = {
    from: {
      email: process.env.SENDGRID_EMAIL_FROM,
      name: "cmSnip - Forgot Password",
    },
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await sgMail.send(mailOptions);
};

export default sendEmail;

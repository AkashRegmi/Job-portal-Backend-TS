import nodemailer from "nodemailer";
import { config, configDotenv } from "dotenv";
configDotenv({path:"./.env"})
console.log(process.env.USER_EMAIL);
console.log(process.env.APP_PASS);
console.log(process.env.APP_HOST);
//setting the Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.HOST,
  port: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASS,
  },
});

//this is for the rejecting the user Email
export const sendingRejectionEmail = async (to: string, name: string) => {
  await transporter.sendMail({
    from: `"HR TEAM" <${process.env.USER_EMAIL}>`,
    to,
    subject: "Your job Application",
    html: ` <p>Hi ${name},</p>
        <p>We regret to inform you that your application has been <b>rejected</b>.</p>
        <p>Thank you for your interest, and we encourage you to apply for future opportunities.</p>
        <br/>
        <p>Best regards,</p>
        <p>Recruitment Team</p>`,
  });
};

//This is for the Approving the Joob Application
export const sendingApproveApplication = async (to: string, name: string) => {
  await transporter.sendMail({
    from: `"HR Team  <${process.env.USER_EMAIL}>`,
    to,
    subject: "Your job Application Status",
    html: `<p>Hi ${name},</p>
        <p>We are Excited  to inform you that your application has been <b>Approved</b>.</p>
        <p>Thank you for your interest, and we encourage you to join our Team from Next Sunday.</p>
        <br/>
        <p>Best regards,</p>
        <p>Recruitment Team</p>
            `,
  });
};

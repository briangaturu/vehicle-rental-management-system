"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendNotificationEmail = async (email, firstname, lastname, subject, message) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: subject,
            text: `${message}\n`,
            html: `
        <html>
        <body>
          <div class="email-container">    
            <h2>${subject}</h2>
             <p>Hello, ${firstname} , ${message}</p>
            <p>Enjoy Our Services!</p>            
          </div>
        </body>
        </html>
      `,
        };
        const mailRes = await transporter.sendMail(mailOptions);
        if (mailRes.accepted.length > 0) {
            return "Notification email sent successfully";
        }
        else if (mailRes.rejected.length > 0) {
            return "Notification email not sent, please try again";
        }
        else {
            return "Email server error";
        }
    }
    catch (error) {
        console.error(error);
        return "Email server error";
    }
};
exports.sendNotificationEmail = sendNotificationEmail;

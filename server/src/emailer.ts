import nodemailer from 'nodemailer';
import { GMAIL_FROM, GMAIL_PASSWORD } from './config';

interface MailOptions {
    from: string;
    to: string;
    body: string;
    password: string;
    userName: string;
    otp: string;
}

const bodyHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>duobrain OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #5046E4;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
            margin: 10px 0;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #5046E4;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to duobrain</h1>
        </div>
        <div class="content">
            <p>Hi there, $$userName$$</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp">$$otp_code$$</div>
            <p>Please use this code to proceed. This OTP is valid for the next 10 minutes.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;

async function sendMail(m: MailOptions) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: m.from,
            pass: m.password,
        }
    });
    m.body = String(m.body);
    m.body = m.body.replace(/\$\$userName\$\$/g, m.userName || "User");
    m.body = m.body.replace(/\$\$otp_code\$\$/g, m.otp || "000000");
    const mailOptions = {
        from: m.from,
        to: m.to,
        html: m.body,
        subject: 'duobrain - OTP Verification',
    };
    try {
        await transporter.sendMail(mailOptions);
        return { "code": 1, "error": "" };
    } catch (err) {
        ``
        return { "code": 0, "error": err };
    }
}


async function Mail(rq: { emailAddress: string; userName: string, otp: string }) {
    try {
        const body = bodyHTML;
        const password = GMAIL_PASSWORD;
        const from = GMAIL_FROM;
        const to = rq.emailAddress;
        const userName = rq.userName;
        const otp = rq.otp;
        const m = {
            from,
            to,
            body,
            password: password,
            userName: userName,
            otp: otp,
        };
        const res = await sendMail(m);
        return res;
    } catch (err) {
        return { "code": 0, "error": err };
    }
}

export { Mail };
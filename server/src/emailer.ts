import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import { GMAIL_FROM, GMAIL_PASSWORD } from './config';

interface MailOptions {
    from: string;
    to: string;
    body: string;
    password: string;
    userName: string;
    otp: string;
}

async function sendMail(m : MailOptions) {
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
    console.log("Modified Body:", m.body);
    const mailOptions = {
        from: m.from,
        to: m.to,
        html: m.body,
        subject: 'duobrain - OTP Verification',
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return { "code": 1, "error": "" };
    } catch (err) {
        console.error("Failed to send email:", err);
        return { "code": 0, "error": err };
    }
}


async function Mail(rq: { emailAddress: string; userName: string, otp: string }) {
    try {
        const body = await fs.readFile('./body.html', 'utf-8');
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
        return {"code":0, "error": err};
    }
}

export { Mail };
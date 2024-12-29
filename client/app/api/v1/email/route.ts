import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { UserModel } from "../model";
import { Mail } from "../emailer";
import { changeOTP } from "../config";
import { z } from "zod";

export async function POST(req: NextApiRequest) {
    try {
		const requiredBody = z.object({
			emailAddress: z.string().email("Invalid email"),
			userName: z.string().min(3, "username must be atleast 3 characters long").max(50, "username must be atmost 50 characters long")
		})
		const parsedDataWithSuccess = requiredBody.safeParse(req.body);
		if (!parsedDataWithSuccess.success) {
			const majorIssue = (parsedDataWithSuccess.error.issues[0].message);
			NextResponse.json({
				message: majorIssue,
				actualCode: 411,
				error: parsedDataWithSuccess.error.issues
			});
			return;
		}
		const emailAddress: string = req.body.emailAddress;
		const userName: string = req.body.userName;
        console.log(emailAddress, userName);
		const emailExists = await UserModel.findOne({ email: emailAddress });
		if (emailExists) {
			NextResponse.json({
				message: "Email already exists",
				actualCode: 403
			});
			return;
		}
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const mail_res = await Mail({ emailAddress, userName, otp });
		changeOTP(otp);
		if (mail_res.error) {
			NextResponse.json({
				message: 'Failed to process email',
				email: "Mail not sent",
				actualCode: 500,
				error: mail_res.error
			});
			return;
		}
		NextResponse.json({
			message: "Email sent successfully",
			actualCode: 200
		});
	} catch (error) {
		console.error(error);
		NextResponse.json({
			message: 'Failed to process email',
			actualCode: 500,
			error: (error as Error).message
		});
		return;
	}
}
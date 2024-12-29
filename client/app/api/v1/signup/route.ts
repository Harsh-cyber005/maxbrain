import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { z } from "zod";
import { UserModel } from "../model";
import bcrypt from "bcryptjs";
import { OTP } from "../config";

const tailwindColors = [
	'#f87171', // red-500
	'#fbbf24', // yellow-500
	'#34d399', // green-500
	'#60a5fa', // blue-500
	'#a78bfa', // purple-500
	'#f472b6', // pink-500
	'#fb923c', // orange-500
	'#38bdf8', // sky-500
	'#22d3ee', // cyan-500
	'#14b8a6', // teal-500
	'#8b5cf6', // violet-500
	'#eab308', // amber-500
	'#84cc16', // lime-500
	'#4ade80', // emerald-500
	'#6366f1', // indigo-500
	'#64748b', // slate-500
	'#6b7280', // gray-500
	'#737373', // neutral-500
	'#737373', // stone-500
];

function checkOTP(sent: string): boolean{
	if(sent === OTP){
		return true;
	}
	return false;
}

export default async function POST(req: NextApiRequest) {
    const requiredBody = z.object({
        username: z
            .string()
            .min(3, "username must be atleast 3 characters long")
            .max(50, "username must be atmost 50 characters long"),
        password: z
            .string()
            .min(5, "password must be atleast 5 characters long")
            .max(50, "password must be atmost 50 characters long"),
        email: z
            .string()
            .email("Invalid email"),
        otp: z.string()
    });
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        return NextResponse.json({
            message: "Invalid input, provide valid email, name and password",
            actualCode: 411,
            error: parsedDataWithSuccess.error.issues
        });
    }
    const username: string = req.body.username;
    const password: string = req.body.password;
    const email: string = req.body.email;
    const otp: string = req.body.otp;
    if (!checkOTP(otp)) {
        NextResponse.json({
            message: "Invalid OTP",
            actualCode: 403
        });
        return;
    }
    const userExists = await UserModel.findOne({ username: username });
    if (userExists) {
        NextResponse.json({
            message: "User Already exists",
            actualCode: 403
        });
        return;
    }
    const emailExists = await UserModel.findOne({ email: email });
    if (emailExists) {
        NextResponse.json({
            message: "Email already exists",
            actualCode: 403
        });
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const initial = username[0].toUpperCase();
        const fromColor = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
        const toColor = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
        const user = new UserModel({
            username: username,
            password: hashedPassword,
            email: email,
            initial: initial,
            colors: {
                from: fromColor,
                to: toColor
            }
        });
        await user.save();
        NextResponse.json({
            message: "Signed up successfully",
            actualCode: 200
        });
    } catch (e) {
        NextResponse.json({
            message: "Internal server error",
            actualCode: 500,
            error: e
        })
    }
}
import express from 'express';
import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcryptjs";
import { UserModel, ContentModel, ShareLinkModel } from './model';
import { JWT_SECRET } from './config';
import { auth } from './middleware';
import cors from 'cors';
import { Mail } from './emailer';
import { v4 as UUID } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let OTP: string = "";

function checkOTP(sent: string): boolean{
	if(sent === OTP){
		return true;
	}
	return false;
}

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

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/api/v1/signup', async (req, res) => {
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
		res.status(411).json({
			message: "Invalid input, provide valid email, name and password",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const username: string = req.body.username;
	const password: string = req.body.password;
	const email: string = req.body.email
	const otp: string = req.body.otp;
	if(!checkOTP(otp)){
		res.status(403).json({
			message: "Invalid OTP"
		});
		return;
	}
	const userExists = await UserModel.findOne({ username: username });
	if (userExists) {
		res.status(403).json({
			message: "User Already exists"
		});
		return;
	}
	const emailExists = await UserModel.findOne({ email: email });
	if (emailExists) {
		res.status(403).json({
			message: "Email already exists"
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
		res.status(200).json({
			message: "Signed up successfully"
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error"
		})
	}
});

app.post('/api/v1/email', async (req, res) => {
	try {
		const requiredBody = z.object({
			emailAddress: z.string(),
			userName: z.string()
		})
		const parsedDataWithSuccess = requiredBody.safeParse(req.body);
		if (!parsedDataWithSuccess.success) {
			res.status(411).json({
				message: "Invalid input, provide valid email and name",
				error: parsedDataWithSuccess.error.issues
			});
			return;
		}
		const emailAddress: string = req.body.emailAddress;
		const userName: string = req.body.userName;
		const emailExists = await UserModel.findOne({ email: emailAddress });
		if (!emailExists) {
			res.status(403).json({
				message: "Email does not exist"
			});
			return;
		}
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const mail_res = await Mail({ emailAddress, userName, otp });
		OTP = otp;
		if (mail_res.error) {
			res.status(500).json({
				message: 'Failed to process email',
				email: "Mail not sent",
				error: mail_res.error
			});
			return;
		}
		res.status(200).json({
			message: "Email sent successfully"
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Failed to process email',
			error: (error as Error).message
		});
		return;
	}
})

app.post('/api/v1/signin', async (req, res) => {
	const requiredBody = z.object({
		username: z.string(),
		password: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid email, name and password",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const username: string = req.body.username;
	const password: string = req.body.password
	const user = await UserModel.findOne({ username: username });
	if (!user) {
		res.status(403).json({
			message: "user does not exist"
		});
		return;
	}
	try {
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			res.status(403).json({
				message: "Invalid password"
			});
			return;
		}
		const token = jwt.sign({
			userid: user._id,
		}, JWT_SECRET, {
			expiresIn: "30d"
		});
		user.token = token;
		await user.save();
		res.status(200).json({
			message: "Signed in successfully",
			token: token
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.get('/api/v1/user', auth, async (req, res) => {
	const userid = req.body.userid;
	try {
		const user = await UserModel.findOne({ _id: userid });
		if (!user) {
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		res.status(200).json({
			username: user.username,
			share: user.share,
			shareLink: user.shareableLink,
			shareSome: user.shareSome,
			shareLinkSome: user.shareableLinkSome,
			colors: user.colors,
			initial: user.initial
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error"
		});
		return;
	}
});

app.post('/api/v1/content', auth, async (req, res) => {
	const requiredBody = z.object({
		content: z.string().optional(),
		title: z.string(),
		link: z.string().optional(),
		userid: z.string(),
		tags: z.array(z.string()).optional()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid content, title, link and userid",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	try {
		const content = req.body.content;
		const title = req.body.title;
		const link = req.body.link;
		const userid = req.body.userid;
		const tags = req.body.tags;
		const type = req.body.type;
		const date = {
			day: new Date().getDate(),
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear()
		}

		const contentModel = new ContentModel({
			content: content,
			title: title,
			link: link,
			userId: userid,
			tags: tags,
			type: type,
			date: date
		});
		await contentModel.save();
		res.status(200).json({
			message: "Content saved successfully"
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.get('/api/v1/content', auth, async (req, res) => {
	const userid = req.body.userid;
	try {
		const contents = await ContentModel.find({ userId: userid }).populate("userId", "username");
		res.status(200).json({
			contents: contents
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.delete('/api/v1/content', auth, async (req, res) => {
	const requiredBody = z.object({
		contentId: z.string(),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid contentId",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contentId = req.body.contentId;
	const userid = req.body.userid;
	try {
		await ContentModel.deleteOne({ _id: contentId, userId: userid });
		res.status(200).json({
			message: "Content deleted successfully"
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.delete('/api/v1/content/selected', auth, async (req, res) => {
	const requiredBody = z.object({
		contentIds: z.array(z.string()),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid contentIds",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contentIds = req.body.contentIds;
	const userid = req.body.userid;
	try {
		await ContentModel.deleteMany({ _id: { $in: contentIds }, userId: userid });
		res.status(200).json({
			message: "Contents deleted successfully"
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.post('/api/v1/brain/share', auth, async (req, res) => {
	const requiredBody = z.object({
		share: z.boolean(),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid share",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const share = req.body.share;
	const userid = req.body.userid;
	try {
		const user = await UserModel.findOne({ _id: userid });
		if (!user) {
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		user.share = share;
		await user.save();
		if (share) {
			const shortID = UUID();
			await ShareLinkModel.create({
				shortLink: shortID,
				userId: user._id
			});
			user.shareableLink = shortID;
			await user.save();
			res.status(200).json({
				message: "Share status updated successfully",
				shareableLink: user.shareableLink
			});
		} else {
			await ShareLinkModel.deleteOne({ shortLink: user.shareableLink, userId: user._id });
			user.shareableLink = "";
			await user.save();
			res.status(200).json({
				message: "Share status updated successfully"
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.get('/api/v1/brain/:shareLink', async (req, res) => {
	try {
		const shareLink = req.params.shareLink;
		const shareLinkExists = await ShareLinkModel.findOne({ shortLink: shareLink });
		if (!shareLinkExists) {
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		const userid = shareLinkExists.userId;
		const user = await UserModel.findOne({ _id: userid })
		if (!user) {
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		if (shareLink !== user.shareableLink) {
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		if (!user.share) {
			res.status(404).json({
				message: "Share has been disabled"
			});
			return;
		}
		const contents = await ContentModel.find({ userId: userid });
		res.status(200).json({
			username: user.username,
			contents: contents
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.post('/api/v1/brain/share/selected', auth, async (req, res) => {
	const requiredBody = z.object({
		share: z.boolean(),
		contentids: z.array(z.string()),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid share",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const share = req.body.share;
	const userid = req.body.userid;
	const contentids = req.body.contentids;
	try {
		const user = await UserModel.findOne({ _id: userid });
		if (!user) {
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		user.shareSome = share;
		await user.save();
		if (share) {
			const contents = await ContentModel.find({ _id: { $in: contentids } });
			if (!contents) {
				res.status(404).json({
					message: "Content does not exist"
				});
				return;
			}
			for (let i = 0; i < contents.length; i++) {
				if (contents[i]?.userId?.toString() !== userid) {
					res.status(403).json({
						message: "Unauthorized"
					});
					return;
				}
				contents[i].visibility = "public";
				await contents[i].save();
			}
			const shortID = UUID();
			await ShareLinkModel.create({
				shortLink: shortID,
				userId: user._id
			});
			user.shareableLinkSome = shortID;
			await user.save();
			res.status(200).json({
				message: "Share status updated successfully",
				shareableLink: user.shareableLinkSome
			});
		} else {
			await ShareLinkModel.deleteOne({ shortLink: user.shareableLinkSome, userId: user._id });
			user.shareableLinkSome = "";
			await user.save();
			const contents = await ContentModel.find({ visibility: "public", userId: userid });
			for (let i = 0; i < contents.length; i++) {
				contents[i].visibility = "private";
				await contents[i].save();
			}
			res.status(200).json({
				message: "Share status updated successfully"
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.get('/api/v1/brain/selected/:shareLink', async (req, res) => {
	try {
		const shareLink = req.params.shareLink;
		const shareLinkExists = await ShareLinkModel.findOne({ shortLink: shareLink });
		if (!shareLinkExists) {
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		const userid = shareLinkExists.userId;
		const user = await UserModel.findOne({ _id: userid })
		if (!user) {
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		if (shareLink !== user.shareableLinkSome) {
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		if (!user.shareSome) {
			res.status(404).json({
				message: "Share has been disabled"
			});
			return;
		}
		const contents = await ContentModel.find({ userId: userid, visibility: "public" });
		res.status(200).json({
			username: user.username,
			contents: contents
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
});

app.post('/api/v1/brain/merge', auth, async (req, res) => {
	const requiredBody = z.object({
		contents: z.array(
			z.object({
				content: z.string(),
				title: z.string(),
				link: z.string(),
				tags: z.array(z.string()),
				userId: z.string(),
				type: z.string(),
				date: z.object({
					day: z.string(),
					month: z.string(),
					year: z.string()
				}),
				visibility: z.string()
			})
		),
		username: z.string(),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success) {
		res.status(411).json({
			message: "Invalid input, provide valid contents",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contents = req.body.contents;
	const userid = req.body.userid;
	try {
		const user = await UserModel.findOne({ _id: userid });
		if (!user) {
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		if (user.username === req.body.username) {
			res.status(403).json({
				message: "Cannot merge your own contents"
			});
			console.log("Cannot merge your own contents");
			return;
		}
		for (let i = 0; i < contents.length; i++) {
			const content = new ContentModel({
				content: contents[i].content,
				title: contents[i].title,
				link: contents[i].link,
				userId: userid,
				tags: contents[i].tags,
				type: contents[i].type,
				date: contents[i].date,
				visibility: contents[i].visibility
			});
			await content.save();
		}
		res.status(200).json({
			message: "Contents merged successfully"
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error",
			error: e
		});
		return;
	}
}
);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
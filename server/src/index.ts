import express from 'express';
import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcryptjs";
import { UserModel, ContentModel } from './model';
import { JWT_SECRET } from './config';
import { auth } from './middleware';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
			.max(50, "password must be atmost 50 characters long")
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
	const userExists = await UserModel.findOne({ username: username });
	if (userExists) {
		res.status(403).json({
			message: "User Already exists"
		});
		return;
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 5);
		const user = new UserModel({
			username: username,
			password: hashedPassword
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
	try{
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
			message: "Internal server error"
		});
		return;
	}
});

app.get('/api/v1/user', auth, async (req, res) => {
	const userid = req.body.userid;
	try{
		const user = await UserModel.findOne({ _id: userid });
		if(!user){
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		res.status(200).json({
			username: user.username,
			share: user.share,
			shareLink: user.shareableLink,
		});
	} catch (e) {
		res.status(500).json({
			message: "Internal server error"
		});
		return;
	}
});

app.post('/api/v1/content',auth, async (req, res) => {
	const requiredBody = z.object({
		content: z.string().optional(),
		title: z.string(),
		link: z.string().optional(),
		userid: z.string(),
		tags: z.array(z.string()).optional()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid content, title, link and userid",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	try{
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

app.get('/api/v1/content',auth, async (req, res) => {
	const userid = req.body.userid;
	try{
		const contents = await ContentModel.find({ userId: userid }).populate("userId","username");
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

app.delete('/api/v1/content',auth, async (req, res) => {
	const requiredBody = z.object({
		contentId: z.string(),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid contentId",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contentId = req.body.contentId;
	const userid = req.body.userid;
	try{
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

app.delete('/api/v1/content/selected',auth, async (req, res) => {
	const requiredBody = z.object({
		contentIds: z.array(z.string()),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid contentIds",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contentIds = req.body.contentIds;
	const userid = req.body.userid;
	try{
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

app.post('/api/v1/brain/share',auth, async (req, res) => {
	const requiredBody = z.object({
		share: z.boolean(),
		userid: z.string()
	});
	const parsedDataWithSuccess = requiredBody.safeParse(req.body);
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid share",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const share = req.body.share;
	const userid = req.body.userid;
	try{
		const user = await UserModel.findOne({ _id: userid });
		if(!user){
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		user.share = share;
		await user.save();
		if(share){
			const shareParam = jwt.sign({
				userid: user._id
			}, JWT_SECRET, {
				expiresIn: "30d"
			});
			user.shareableLink = shareParam;
			await user.save();
			res.status(200).json({
				message: "Share status updated successfully",
				shareableLink: user.shareableLink
			});
		} else {
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
	try{
		const shareLink = req.params.shareLink;
		const decoded = jwt.verify(shareLink, JWT_SECRET);
		if(typeof decoded === "string"){
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		const userid = decoded.userid;
		const user = await UserModel.findOne({ _id: userid})
		if(!user){
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		if(shareLink !== user.shareableLink){
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		if(!user.share){
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
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid share",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const share = req.body.share;
	const userid = req.body.userid;
	const contentids = req.body.contentids;
	try{
		const user = await UserModel.findOne({ _id: userid});
		if(!user){
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		user.shareSome = share;
		await user.save();
		if(share){
			const contents = await ContentModel.find({ _id: { $in: contentids } });
			if(!contents){
				res.status(404).json({
					message: "Content does not exist"
				});
				return;
			}
			for(let i=0; i<contents.length; i++){
				if(contents[i]?.userId?.toString() !== userid){
					res.status(403).json({
						message: "Unauthorized"
					});
					return;
				}
				contents[i].visibility = "public";
				await contents[i].save();
			}
			const shareParam = jwt.sign({
				userid: user._id
			}, JWT_SECRET, {
				expiresIn: "30d"
			});
			user.shareableLinkSome = "http://localhost:5000/api/v1/brain/newron/"+shareParam;
			await user.save();
			res.status(200).json({
				message: "Share status updated successfully",
				shareableLink: user.shareableLinkSome
			});
		} else {
			user.shareableLinkSome = "";
			await user.save();
			const contents = await ContentModel.find({visibility: "public", userId: userid});
			for(let i=0; i<contents.length; i++){
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
	try{
		const shareLink = req.params.shareLink;
		const decoded = jwt.verify(shareLink, JWT_SECRET);
		if(typeof decoded === "string"){
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		const userid = decoded.userid;
		const user = await UserModel.findOne({ _id: userid})
		if(!user){
			res.status(403).json({
				message: "Unauthorized"
			});
			return;
		}
		if("http://localhost:5000/api/v1/brain/newron/"+shareLink !== user.shareableLinkSome){
			res.status(403).json({
				message: "Link expired"
			});
			return;
		}
		if(!user.shareSome){
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
	if (!parsedDataWithSuccess.success){
		res.status(411).json({
			message: "Invalid input, provide valid contents",
			error: parsedDataWithSuccess.error.issues
		});
		return;
	}
	const contents = req.body.contents;
	const userid = req.body.userid;
	try{
		const user = await UserModel.findOne({ _id: userid});
		if(!user){
			res.status(403).json({
				message: "User does not exist"
			});
			return;
		}
		if(user.username === req.body.username){
			res.status(403).json({
				message: "Cannot merge your own contents"
			});
			console.log("Cannot merge your own contents");
			return;
		}
		for(let i=0; i<contents.length; i++){
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
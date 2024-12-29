import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from './config';

interface ResponseData {
    message: string;
    error: string;
}

export const auth = async (req:NextApiRequest, res:NextApiResponse<ResponseData>) => {
    try{
        const header = req.headers.authorization;
        if (!header) {
            res.status(401).json({
                message: "Unauthorized",
                error: ""
            });
            return;
        }
        const token = header as string;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                message: "Unauthorized",
                error: ""
            });
            return;
        }
        if(typeof decoded === "string"){
            res.status(401).json({
                message: "Unauthorized",
                error: ""
            });
            return;
        }
        req.body.userid = decoded.userid;
    } catch (e) {
        res.status(500).json({
            message: "Internal server error",
            error: e as string
        });
    }
}
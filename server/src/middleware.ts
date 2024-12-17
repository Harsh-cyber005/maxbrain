import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from './config';

export const auth = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const header = req.headers.authorization;
        if (!header) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const token = header as string;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        if(typeof decoded === "string"){
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        req.body.userid = decoded.userid;
        next();
    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
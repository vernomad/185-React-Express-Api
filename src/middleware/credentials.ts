import { Request, Response, NextFunction } from "express";
import allowedOrigins from "../config/allowedOrigins";

const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Check if origin is defined and included in allowedOrigins
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    next();
};

export default credentials; 

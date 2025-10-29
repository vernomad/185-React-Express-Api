import {format} from 'date-fns';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from "express";

//import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
const baseDir = path.join(process.cwd(), "data")

const logEvents = async (message: string, logName: string) => {
    if (!message || !logName) {
        console.warn("Undefined message or logName in logEvents call:", { message, logName });
    }

    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    const logPath = path.join(baseDir, 'logs');
    
    try {
        await fsPromises.access(logPath).catch(() => fsPromises.mkdir(logPath));
        await fsPromises.appendFile(path.join(logPath, logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = async (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || 'No origin';
    await logEvents(`${req.method}\t${origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

export default { logger, logEvents };
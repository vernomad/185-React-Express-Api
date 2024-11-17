import { Request, Response } from "express";
import logEvents from "./logEvents"

// const errorHandler = (err: Error, req: Request, res: Response ) => {
//     logEvents.logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//     console.error(err.stack)
//     res.status(500).send(err.message);
// }
const errorHandler = (err: Error, req: Request, res: Response) => {
    const errorName = err.name || "UnknownError";
    const errorMessage = err.message || "No error message provided";
    
    logEvents.logEvents(`${errorName}: ${errorMessage}`, 'errLog.txt');
    console.error(err.stack || `${errorName}: ${errorMessage}`);
    
    res.status(500).send(errorMessage);
};
export default errorHandler
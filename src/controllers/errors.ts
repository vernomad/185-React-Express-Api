import { Response } from "express";

export class ErrorWithStatusCode extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ErrorWithStatusCode.prototype); // For extending built-in classes
  }
}

export function handleError(e: Error, res: Response) {
  if (e instanceof ErrorWithStatusCode) {
     res.status(e.status).json({ message: e.message });
     return
  }
   res.status(500).json({ message: "Server error" });
}
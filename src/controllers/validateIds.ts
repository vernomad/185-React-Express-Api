import { Request, Response, NextFunction } from 'express';

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || !req.params.id.trim()) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};
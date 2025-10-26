import express from "express";
import multer, { FileFilterCallback } from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    req: express.Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
  ): void => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});
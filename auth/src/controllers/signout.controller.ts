import { Request, Response } from "express";
export const signOut = (req: Request, res: Response) => {
  req.session = null;
  res.json({});
};

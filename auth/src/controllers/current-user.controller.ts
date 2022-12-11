import { Request, Response } from "express";

export const getCurrentUser = (req: Request, res: Response) => {
  res.json({ currentUser: req.user?.user });
};

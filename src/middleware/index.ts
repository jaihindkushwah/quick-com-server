import { AuthUtilsService } from "@/service/auth.util";
import { NextFunction, Request, Response } from "express";

export const optionalAuthWithValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const authUtils = new AuthUtilsService();
      const decoded = authUtils.verifyToken(token);
      (req as any).user = decoded; // Attach decoded user to request
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  next();
};

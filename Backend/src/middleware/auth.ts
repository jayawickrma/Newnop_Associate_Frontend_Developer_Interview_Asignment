import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface JwtPayload {
    id: string;
    email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: "Access token missing" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
        (req as any).user = payload; // attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

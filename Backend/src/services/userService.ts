import { User } from "../models/UserModel";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserService {

    async login(email: string, password: string) {

        const user = await this.findByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as Secret,
            { expiresIn: "7d" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN as Secret,
            { expiresIn: "7d" }
        );

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async register(user: User) {
        const hashedPw = await bcrypt.hash(user.password, 10);

        try {
            const createdUser = await prisma.user.create({
                data: {
                    email: user.email,
                    password: hashedPw,
                    name: user.name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            return createdUser;
        } catch (e: any) {
            console.error(e);
            throw new Error("Failed to register user");
        }
    }

    async findByEmail(email: string) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            console.log("existingUser:", existingUser);
            return existingUser;
        } catch (err) {
            console.error(err);
            throw new Error("Error checking user credentials");
        }
    }

    async findById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });
            return user;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}

const userService = new UserService();
export default userService;
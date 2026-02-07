import user_service from "../services/userService";
import {User} from "../models/UserModel";


class UserController{

    async login(req: any, res: any) {
        const { email, password } = req.body;
        console.log(req.body);
        console.log("email :", email);
        console.log("password :", password);
        try {
            const result = await user_service.login(email, password);
            console.log(result.accessToken);
            return res.status(200).json(result);
        } catch (e: any) {
            return res.status(401).json({ message: e.message });
        }
    }


    async signUp(req:any,resp:any){
        const user:User =req.body;
        try{
            await user_service.register(user)
            resp.status(201).send('Account Created !');
        }catch (e:any){
            console.log(e)
            resp.status(500).error(e.message);
        }
    }

    async getCurrentUser(req: any, res: any) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const user = await user_service.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({
                id: user.id,
                email: user.email,
                name: user.name,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch user" });
        }
    }


}
const user_controller = new UserController();
export default user_controller;
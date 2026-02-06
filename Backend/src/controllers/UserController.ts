import user_service from "../services/userService";
import {User} from "../models/UserModel";


class UserController{

    async login(req:any,resp:any){
        const email =req.body.email;
        const password =req.body.password;

        const user:User = {
            email, password,
            name: ''
        }

        try{
            const varify_user = await user_service.findByEmail(user)
                if(varify_user){
                    await user_service.login(user.email,user.password)
                }
            resp.status(200).send('Login Success');
        }catch (e:any){
            console.error(e);
            resp.status(500).error(e.message);
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
}
const user_controller = new UserController();
export default user_controller;
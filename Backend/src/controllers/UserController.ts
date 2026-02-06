class UserController{

    async login(req:any,resp:any){
        try{

            resp.status(200).send('Login Success');
        }catch (e:any){
            console.error(e);
            resp.status(500).error(e.message);
        }
    }

    async signUp(req:any,resp:any){
        try{
            resp.status(201).send('Account Created !');
        }catch (e:any){
            console.log(e)
            resp.status(500).error(e.message);
        }
    }
}
const user_controller = new UserController();
export default user_controller;
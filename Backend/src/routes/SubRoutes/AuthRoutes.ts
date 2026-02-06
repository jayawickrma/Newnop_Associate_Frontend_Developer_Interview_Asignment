import {Router} from 'express';
import user_controller from "../../controllers/UserController";
import {authenticateToken} from "../../middleware/auth";

class AuthRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.use('/login', user_controller.login)
        this.router.use('/signUp', user_controller.signUp);
        this.router.use('/me',authenticateToken, user_controller.getCurrentUser)
    }
}
const auth_route = new AuthRoutes();
export default auth_route;
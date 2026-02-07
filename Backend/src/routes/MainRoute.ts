import {Router} from 'express';
import auth_route from "./SubRoutes/AuthRoutes";
import issue_route from "./SubRoutes/IssuesRoutes";
import healthCheckRoute from "./SubRoutes/HealthCheckRoute";
import {authenticateToken} from "../middleware/auth";

class MainRoute{
    router:Router;

    constructor() {
        this.router = Router();
        this.router.use('/auth', auth_route.router);
        this.router.use('/issue', authenticateToken, issue_route.router);
        this.router.use('/health', healthCheckRoute.router);
    }

}
const main_route = new MainRoute();
export default main_route;
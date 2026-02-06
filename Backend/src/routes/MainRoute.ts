import {Router} from 'express';
import auth_route from "./SubRoutes/AuthRoutes";
import issue_route from "./SubRoutes/IssuesRoutes";

class MainRoute{
    router:Router;

    constructor() {
        this.router = Router();
        this.router.use('/auth', auth_route.router);
        this.router.use('/issue', issue_route.router);
    }

}
const main_route = new MainRoute();
export default main_route;
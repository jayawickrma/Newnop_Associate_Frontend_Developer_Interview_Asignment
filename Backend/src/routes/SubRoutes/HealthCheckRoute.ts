import {Router} from 'express';
import healthCheck from "../../controllers/HealthCheck";

class healthCheckRouteRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/health-check', healthCheck.healthCheck)

    }
}
const health_check = new healthCheckRouteRouter();
export default health_check;
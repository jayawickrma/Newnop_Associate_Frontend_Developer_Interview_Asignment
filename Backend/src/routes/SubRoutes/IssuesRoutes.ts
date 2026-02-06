import {Router} from 'express';
import issue_controller from "../../controllers/IssuesController";

class IssuesRoutes {
    router = Router();

    constructor() {
        this.router = Router();
        this.router.use('/issues', issue_controller.getAllIssues);
        this.router.use('/get-issue', issue_controller.getIssue);
        this.router.use('/delete-issues', issue_controller.deleteIssue);
        this.router.use('/update-issue', issue_controller.updateIssue);
        this.router.use('/create-issue', issue_controller.saveIssue)
    }
}

const issue_route = new IssuesRoutes();
export default issue_route;
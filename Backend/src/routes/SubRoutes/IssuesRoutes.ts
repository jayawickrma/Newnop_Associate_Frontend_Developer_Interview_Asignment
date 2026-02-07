import {Router} from 'express';
import issue_controller from "../../controllers/IssuesController";

class IssuesRoutes {
    router = Router();

    constructor() {
        this.router = Router();
        this.router.get('/issues', issue_controller.getAllIssues);
        this.router.get('/get-issue', issue_controller.getIssue);
        this.router.delete('/delete-issues/:id', issue_controller.deleteIssue);
        this.router.put('/update-issue/:id', issue_controller.updateIssue);
        this.router.post('/create-issue', issue_controller.saveIssue)
    }
}

const issue_route = new IssuesRoutes();
export default issue_route;
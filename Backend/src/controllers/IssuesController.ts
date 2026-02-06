import {Issue} from "../models/IssueModel";
import issue_service from "../services/issueService";

class IssuesController {

    async saveIssue(req:any ,resp:any){

        const issue : Issue = req.body;
        try{
            await issue_service.createIssue(issue);
            return resp.status(201).send({"message":"Successfully created issue"});
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async deleteIssue(req:any ,resp:any){
        const id  =  req.query['id'];
        try{
            await issue_service.deleteIssue(id);
            return resp.status(200).send({"message":"Successfully deleted issue"});
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getIssue(req:any ,resp:any){
        const id =  req.query['id'];
        try{
            const issue =await issue_service.getIssueById(id)
            return resp.status(200).send(issue);
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async updateIssue(req:any ,resp:any){
        const id = req.query['id'];
        const issue : Issue = req.body;
        try{
            await issue_service.updateIssue(id,issue)
            return resp.status(200).send({"message":"Successfully updated issue"});
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getAllIssues(req:any ,resp:any){
        try{
            const issues = await issue_service.getAllIssues();
            return resp.status(200).send(issues);
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }
}
const issue_controller = new IssuesController()
export default issue_controller;
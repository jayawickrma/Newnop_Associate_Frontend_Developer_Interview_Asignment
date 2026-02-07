import {Issue} from "../models/IssueModel";
import prisma from "../../prisma/Client";

class IssueService{
    async createIssue(issue:Issue){
        try{


        }catch (error){
            console.log(error);
            return "Failed to create Issue...";
        }

    }

    async updateIssue(issue: Issue, id: Issue){
        try{

        }catch (error){
            console.log(error);
            return "Failed to update Issue...";
        }
    }

    async deleteIssue(id:string){
        try{
            await prisma.issue.delete({
                where:{id:id}
            })
            console.log("Successfully deleted Issue...");
            return "Successfully deleted Issue...";
        }catch (error){
            console.log(error);
            return "Failed to delete Issue...";
        }
    }

    async getIssueById(id:string){
        try{
            const issue =await prisma.issue.findUnique({
                where: {id:id}
            })
            console.log("Successfully getting Issue...",issue);
            return issue;

        }catch (error){
            console.log(error);
            return "Failed to get Issue...";
        }
    }

    async getAllIssues() {
        try {
            const issues = await prisma.issue.findMany();
            console.log("Successfully getting All Issues...", issues);
            return issues; // ✅ Always return array
        } catch (error) {
            console.log(error);
            throw new Error("Failed to get Issues..."); // ✅ Throw error instead of returning string
        }
    }
}
const issue_service = new IssueService();
export default issue_service;
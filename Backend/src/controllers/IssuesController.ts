import {Issue} from "../models/IssueModel";
import issue_service from "../services/issueService";
import prisma from "../../prisma/Client";

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

    async getAllIssues(req: any, resp: any) {
        try {
            const { search, status, priority, page = 1, limit = 10 } = req.query;

            // Build filter object
            const where: any = {};
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (status && status !== 'all') where.status = status.toLowerCase();
            if (priority && priority !== 'all') where.priority = priority.toLowerCase();

            const total = await prisma.issue.count({ where });

            const issues = await prisma.issue.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
            });

            const formattedIssues = issues.map((issue: any) => ({
                id: issue.id,
                title: issue.title,
                description: issue.description,
                status: issue.status.toLowerCase().replace('_', '-'),
                priority: issue.priority.toLowerCase(),
                severity: issue.severity.toLowerCase(),
                userId: issue.userId,
                createdAt: issue.createdAt,
                updatedAt: issue.updatedAt,
            }));

            return resp.status(200).json({
                issues: formattedIssues,
                meta: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            });
        } catch (err: any) {
            console.error(err);
            return resp.status(500).json({ message: err.message });
        }
    }

}
const issue_controller = new IssuesController()
export default issue_controller;
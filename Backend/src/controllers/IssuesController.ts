import {Issue} from "../models/IssueModel";
import issue_service from "../services/issueService";
import { Parser } from 'json2csv';

class IssuesController {

    async saveIssue(req: any, resp: any) {

        const issue: Issue = req.body;
        console.log("Create issue Data :", issue);
        try {
            await issue_service.createIssue(issue);
            return resp.status(201).send({"message": "Successfully created issue"});
        } catch (err: any) {
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async deleteIssue(req: any, resp: any) {
        const id = req.params.id;
        console.log("delete by id : ", id)
        if (!id || id === 'undefined') {
            return resp.status(400).json({
                message: "Invalid issue ID"
            });
        }
        try {
            await issue_service.deleteIssue(id);
            return resp.status(200).send({"message": "Successfully deleted issue"});
        } catch (err: any) {
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getIssue(req: any, resp: any) {
        const id = req.query['id'];
        try {
            const issue = await issue_service.getIssueById(id)
            return resp.status(200).send(issue);
        } catch (err: any) {
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async updateIssue(req: any, resp: any) {
        const id = req.params.id;
        const issue: Issue = req.body;
        try {
            await issue_service.updateIssue(id, issue)
            return resp.status(200).send({"message": "Successfully updated issue"});
        } catch (err: any) {
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getAllIssues(req: any, resp: any) {
        try {
            const issues = await issue_service.getAllIssues();


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
                    total: formattedIssues.length,
                    page: 1,
                    limit: formattedIssues.length,
                    totalPages: 1
                }
            });
        } catch (err: any) {
            console.log(err);
            return resp.status(500).json({message: err.message});
        }
    }


    async exportIssuesCSV(req: any, res: any) {
        try {
            const filters = req.query;
            const issues = await issue_service.getAllIssuesForExport(filters);

            if (!issues || issues.length === 0) {
                return res.status(404).json({ message: 'No issues found' });
            }

            const csvData = issues.map((issue: any) => ({
                id: issue.id,
                title: issue.title,
                description: issue.description,
                status: issue.status,
                priority: issue.priority,
                severity: issue.severity,
                userId: issue.userId,
                createdAt: issue.createdAt,
                updatedAt: issue.updatedAt,
            }));

            const parser = new Parser();
            const csv = parser.parse(csvData);

            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', 'attachment; filename=issues.csv');

            return res.status(200).send(csv);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            return res.status(500).json({ message: 'Failed to export CSV' });
        }
    }
}
const issue_controller = new IssuesController()
export default issue_controller;
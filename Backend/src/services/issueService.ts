import { PrismaClient } from "@prisma/client";
import { Issue } from "../models/IssueModel";

const prisma = new PrismaClient();

class IssueService {
    async createIssue(issue: Issue) {
        try {
            const create = await prisma.issue.create({
                data: {
                    title: issue.title,
                    description: issue.description,
                    status: issue.status || "OPEN",
                    priority: issue.priority || "MEDIUM",
                    severity: issue.severity || "MINOR",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return create;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create Issue");
        }
    }

    async updateIssue(id: string, issue: Partial<Issue>) {
        try {
            const update = await prisma.issue.update({
                where: { id: id },
                data: {
                    ...(issue.title && { title: issue.title }),
                    ...(issue.description && { description: issue.description }),
                    ...(issue.status && { status: issue.status }),
                    ...(issue.priority && { priority: issue.priority }),
                    ...(issue.severity && { severity: issue.severity }),
                    updatedAt: new Date()
                }
            });
            return update;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update Issue");
        }
    }

    async deleteIssue(id: string) {
        try {
            await prisma.issue.delete({
                where: { id: id }
            });
            console.log("Successfully deleted Issue...");
            return { message: "Successfully deleted Issue" };
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete Issue");
        }
    }

    async getIssueById(id: string) {
        try {
            const issue = await prisma.issue.findUnique({
                where: { id: id }
            });
            console.log("Successfully getting Issue...", issue);
            return issue;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to get Issue");
        }
    }

    async getAllIssues() {
        try {
            const issues = await prisma.issue.findMany({
                orderBy: { createdAt: 'desc' }
            });
            console.log("Successfully getting All Issues...", issues);
            return issues;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to get Issues");
        }
    }

    async getAllIssuesForExport(filters: any = {}) {
        try {
            const where: any = {};

            if (filters.status && filters.status !== 'all') {
                where.status = filters.status.toUpperCase();
            }

            if (filters.priority && filters.priority !== 'all') {
                where.priority = filters.priority.toUpperCase();
            }

            if (filters.severity && filters.severity !== 'all') {
                where.severity = filters.severity.toUpperCase();
            }

            const issues = await prisma.issue.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });

            return issues;
        } catch (error) {
            console.error('Failed to get Issues for export:', error);
            throw new Error('Failed to get Issues for export');
        }
    }
}

const issue_service = new IssueService();
export default issue_service;
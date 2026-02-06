class IssuesController {

    async saveIssue(req:any ,resp:any){
        try{

        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async deleteIssue(req:any ,resp:any){
        try{
            const id  =  req.params.id;
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getIssue(req:any ,resp:any){
        try{
            const id =  req.params.id;
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async updateIssue(req:any ,resp:any){
        try{
            const id = req.params.id;
        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }

    async getAllIssues(req:any ,resp:any){
        try{

        }catch (err:any){
            console.log(err);
            resp.status(500).send(err.message);
        }
    }
}
const issue_controller = new IssuesController()
export default issue_controller;
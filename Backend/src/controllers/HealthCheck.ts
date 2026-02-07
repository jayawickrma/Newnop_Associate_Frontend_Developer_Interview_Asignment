class HealthCheck {
    async healthCheck(req:any,resp:any) {
        try{
            resp.status(200).send({"status":"OK,Health Check Successfully"});
        }catch (e:any){
            console.log(e)
            resp.status(500).send({"error":"Health Check Failed"})

        }
    }
}
const healthCheck = new HealthCheck()
export default healthCheck;
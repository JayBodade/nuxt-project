import projectModel from "../model/project.model";
export default defineEventHandler(async (event) => {
  if(event.node.req.method == "GET"){
    const projects = await projectModel.find();
    event.node.res.statusCode = 200;
    return projects;
  
    
  }else {
    event.node.res.statusCode = 405;
    return {
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }
})

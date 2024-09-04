import projectModel from "../model/project.model";
export default defineEventHandler(async (event) => {
  if(event.node.req.method == "GET"){
    const projects = await projectModel.find({projectType:'Landscape'});
    event.node.res.statusCode = 200;
    console.log("this is projects",projects);
    return projects;
    
    
  }else {
    event.node.res.statusCode = 405;
    return {
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }
})

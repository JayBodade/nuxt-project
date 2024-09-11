import projectModel from "~/server/model/project.model";
export default defineEventHandler(async (event) => {
  const { id }  = event.context.params;
   if(event.node.req.method == 'PUT'){
    try {
      
      const body = await readBody(event);

      const projectMeta = {
        projectId:body.projectId,
        projectTitle: body.projectTitle, 
        projectClient: body.clientName,
        projectAddress: body.projectAddress,
        projectType:body.projectType,
        projectDescription: body.projectDescription,
        projectThumbnail: body.thumbnail1Url, 
        projectRating:body.projectRating, 
        projectAboutImage: body.thumbnail2Url, 
        projectImages:body.documentsUrl?.map((ele)=>{
         return {docid:ele.docid,urlstring:ele.url}
        } ),
       }

      const updatedProject = await projectModel.findByIdAndUpdate(id,projectMeta,{new:true});

      if (!updatedProject) {
        return {
          statusCode: 404,
          message: "Project not found",
        };
      }

      console.log("this is updatedProject",updatedProject);
      return updatedProject;

    } catch (error) {
      return {
        statusCode: 500,
        message: "Error updating project",
        error: error.message,
      };
    }

   }else {
  
    event.node.res.statusCode = 405;
    return {
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }
})


import projectModel from '~/server/model/project.model';
export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
   const body = await readBody(event);

   const projectMeta = {
    projectId:body.projectId,
    projectTitle: body.projectTitle, 
    projectClient: body.clientName,
    projectAddress: body.projectAddress,
    projectType:body.projectType,
    projectDescription: body.projectDescription,
    projectThumbnail: body.thumbnail1Url,  
    projectAboutImage: body.thumbnail2Url, 
    projectRating:body.projectRating,
    projectImages:body.documentsUrl?.map((ele)=>{
     return {docid:ele.docid,urlstring:ele.url}
    } ),
   }

   const product = await projectModel.create(projectMeta);
   return product;
  } else {
    event.node.res.statusCode = 405;
    return {
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }
});

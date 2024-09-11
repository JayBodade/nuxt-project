import projectModel from "~/server/model/project.model";
export default defineEventHandler(async (event) => {
  const {id} = event.context.params;
  if(event.node.req.method == 'DELETE'){

    const project = await projectModel.findByIdAndDelete({_id:id});
    event.node.res.statusCode = 200;
    return {
      statusCode: 200,
      message: "Project Delete Success Fully",
      success:true
    };

  }else {
  
    event.node.res.statusCode = 405;
    return {
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }
})

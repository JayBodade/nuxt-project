import projectModel from "~/server/model/project.model";

export default defineEventHandler(async (event) => {
  try {
  
    const { projectId } = event.context.params;
    const { docid } = getHeaders(event);

  
    const project = await projectModel.findOne({ _id: projectId });

    if (!project) {
      throw new Error(`Project with id ${projectId} not found.`);
    }

    
    const updatedProjectImages = project.projectImages.filter((ele) => ele.docid !== docid);

    
    const updateProject = await projectModel.findOneAndUpdate(
      { _id: projectId },
      { projectImages: updatedProjectImages },
      { new: true } // Option to return the updated document
    );

    if (!updateProject) {
      throw new Error(`Unable to update project with id ${projectId}.`);
    }

    return updateProject;
  } catch (error) {
    // Error handling
    event.node.res.statusCode = 500;
    return {
      statusCode: 500,
      message: error.message || "An error occurred while updating the project"
    };
  }
});

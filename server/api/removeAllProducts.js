import projectModel from '~/server/model/project.model';
export default defineEventHandler(async (event) => {
   const removeAll = await projectModel.updateMany({},{$set:{projectImages:[]}})
  //  return removeAll;
  return removeAll;
})

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true }, 
  projectClient: { type: String },
  projectAddress: { type: String },
  projectType:{type:String},
  projectDescription: { type: String },
  projectThumbnail: { type: String },  
  projectAboutImage: { type: String }, 
  projectImages: [{ type: String }],   
});


const projectModel = mongoose.model('Project', projectSchema);
export default projectModel;

import path from 'path'
import formidable from 'formidable';
import { promises as fs } from 'fs';
import projectModel from './../model/project.model';
export default defineEventHandler(async (event) => {
    if (event.node.req.method === "POST") {
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir,{recursive:true});

        const form = formidable({
            uploadDir,
            keepExtensions:true,
            maxFileSize:10*1024*1024
        })
    
        try
        {
           
            
        
        
            const {field,files} = await new Promise((resolve,reject)=>{
                form.parse(event.node.req,(err,field,files)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve({field,files});
                    }
                })

            })

            
            if (!field || !files || !files.file) {
                throw new Error('Missing fields or files in the form data');
              }

          
            

            const uploadedFile = files.file;
            console.log("thi sis uploadedfiles",uploadedFile);
            const projectData = {
                projectTitle:field.projectTitle[0],
                projectClient:field.projectClient[0],
                projectAddress:field.projectAddress[0],
                projectDescription:field.projectDescription[0],
                projectThumbnail:uploadedFile[0].newFilename
            }

            console.log("this is uploaded file",uploadedFile);

            await projectModel.create(projectData);
            
            return {
              message: 'File uploaded successfully',
              file: uploadedFile,
            };

        }catch(e){
            console.log("something went wrong",e);  
        }
     
    } else {
      event.node.res.statusCode = 405;
      return {
        statusCode: 405,
        message: "Method Not Allowed",
      };
    }
  });
  

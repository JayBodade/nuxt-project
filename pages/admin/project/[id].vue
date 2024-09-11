<template>
  <v-container fluid class="custom-layout">
    <v-row no-gutters>
      <!-- Left Section: Text Content -->
  
      <v-col cols="12" md="6" class="text-section">
        <div class="text-content">
          <h3 class="project-title">{{ project.projectTitle }}</h3>
          <h4 class="project-subtitle">{{ project.projectAddress }}</h4>
          <h1 class="company-name">{{project.projectClient}}</h1>
          <v-row class="features mt-5">
            <v-col cols="6" class="feature-item">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              <div>
                <h5>Trusted</h5>
                <p>Over 300+ clients all over Maharashtra love us</p>
              </div>
            </v-col>
            <v-col cols="6" class="feature-item">
              <v-icon class="mr-2">mdi-star-circle</v-icon>
              <div>
                <h5>Quality</h5>
                <p>We pay attention to every single detail.</p>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- Right Section: Image -->
      <v-col cols="12" md="6"  class="image-section">
        <v-btn @click="openDialog"
         color="#4f545c"
         class="me-2 text-none"
      text
      flat
       icon
       
      style="position: absolute; top: 120px; right: 30px; z-index: 2;"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
        <v-img
          :src="project.projectThumbnail" 
          class="project-image"
          height="700px"
          cover
        ></v-img>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-img class="project-image"
        height="700px" :src="project.projectAboutImage">

        </v-img>
      </v-col> 
      <v-col>

      </v-col> 
    </v-row>



    <v-dialog v-model="dialog">
      <v-form>
      <v-card class="pa-6 mt-2 mx-auto custom-card" w max-width="600">
        <v-card-title class="text-h5 text-center">Create Your Project</v-card-title>
        <v-card-subtitle class="mb-4 text-center">Fill in the details to create your project</v-card-subtitle>
        
        <v-card-text>
          <!-- Text Fields -->
          <v-text-field
            label="Project Title"
            placeholder="Enter project title"
            v-model="form.projectTitle"
            variant="outlined"
            clearable
            class="custom-input"
          ></v-text-field>
          
          <v-text-field
            label="Client Name"
            placeholder="Enter client name"
            v-model="form.clientName"
            variant="outlined"
            clearable
            class="custom-input"
          ></v-text-field>

          <v-text-field
            label="Project Address"
            placeholder="Enter project address"
            v-model="form.projectAddress"
            variant="outlined"
            clearable
            class="custom-input"
          ></v-text-field>

          <v-text-field
          type="number"
            label="Project Rating"
            placeholder="Enter project rating"
            v-model="form.projectRating"
            variant="outlined"
            clearable
            class="custom-input"
            :min="1" :max="10"
          ></v-text-field>


          <v-textarea
            label="Project Description"
            placeholder="Enter project description"
            v-model="form.projectDescription"
            variant="outlined"
            clearable
            multiline
            class="custom-input"
          ></v-textarea>

          <!-- Select Field -->
          <v-select
            label="Project Status"
            :items="['Interior', 'Architectural', 'Landscape']"
            v-model="form.projectType"
        variant="outlined"
            class="custom-input"
          ></v-select>

          <!-- File Inputs -->

            
           <file-input @clearFile="clearFile" photoType="thumbnail1" header="Thumbnail 1" @selectFile="handleSelectedFile" :file="form.thumbnail1" :projectId="form.projectId"/>
          <file-input @clearFile="clearFile" photoType="thumbnail2" header="Thumbnail 2" @selectFile="handleSelectedFile2"  :file="form.thumbnail2" :projectId="form.projectId"/>


          <v-file-input
            label="Upload Documents (Multiple)"
            v-model="form.documents"
            accept="image/*"
            multiple
            prepend-icon=""
            variant="outlined"
            @update:modelValue="uploadAllSelectDocuments"
            prepend-inner-icon="mdi-file-document"
            class="custom-input mt-2"
          ></v-file-input>
          <v-row>
    <v-col v-for="doc in form.documentsUrl" :key="doc.docid" cols="4">
      <div class="image-container">
        <v-icon  v-if="!doc.loading" class="close-icon" @click="removeImage(doc.docid)">
          mdi-close
        </v-icon>
        <v-img v-if="!doc.loading" :src="doc.url" height="100px"></v-img>
      <v-skeleton-loader v-else type="ossein" width="100px" height="100px"></v-skeleton-loader>
      </div>
    </v-col>
  </v-row>
        </v-card-text>

        <v-card-actions class="d-flex justify-center flex-column">
          <v-btn color="white" :loading="loading" class="mt-2 mx-auto" block variant="elevated" @click="submitForm" >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    </v-dialog>
   
  </v-container>
</template>

<script setup>
import {ref as storageRef, getDownloadURL,uploadBytes,deleteObject } from 'firebase/storage';
import { ref } from 'vue';
const route = useRoute();
const storage = useFirebaseClient();
let dialog = ref(false);

let loading=ref(false);

async function submitForm(){

  try{

    const response = await fetch(`/api/product/update/${route.params.id}`,{
      method:'PUT',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(form.value)
    })

    const result = await response.json();
    console.log("this is result",result);
    project.value = result;
    dialog.value = false;

  }catch(e){
    console.log("something went wrong",e)
  }

}



function clearFile(){
 
  form.value.thumbnail1 = null;
  console.log("runnong this evet in parent",form);
}

const {data:project} = await useFetch(`/api/product/${route.params.id}`,{
  method:"GET",
  headers:{
    'content-type':'application/json'
  }
})



const form = ref({
  projectId:project.value.projectId,
  projectTitle: project.value.projectTitle,
  clientName:  project.value.projectClient,
  projectAddress: project.value.projectAddress,
  projectDescription: project.value.projectDescription,
  projectType: project.value.projectType,
  projectRating:project.value.projectRating,
  thumbnail1: project.value.projectThumbnail,
  thumbnail2: project.value.projectAboutImage,
  thumbnail1Url:project.value.projectThumbnail,
  thumbnail2Url:project.value.projectAboutImage,
  documents: [],
  documentsUrl:project.value.projectImages.map((ele)=>{
    return {
      url:ele.urlstring,
      loading:false,
      docid:ele.docid

    }
  }),
});



function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function uploadAllSelectDocuments() {
  // const storageFirebase = storage();
  // const storageRef = storageRef(storage,`${form.value.projectId}/`);

 
  if (!form.value.documentsUrl.length) {
    form.value.documentsUrl = form.value.documents.map(() => ({
      url: '',
      loading: true,
      docid:createRandomString(20)
    }));

    for (let i = 0; i < form.value.documents.length; i++) {
      try {
        // const docid = form.value.documentsUrl[i].docid; 
        // const uploadDocuments = storageRef.child(`document${docid}`).put(form.value.documents[i]);
        // const snapshot = await uploadDocuments;
        // let url = await snapshot.ref.getDownloadURL();
        const docid = form.value.documentsUrl[i].docid;
        const file = form.value.documents[i];
        const fileRef = storageRef(storage, `${form.value.projectId}/document${docid}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        form.value.documentsUrl[i].url = url;
        form.value.documentsUrl[i].loading = false;
      } catch (error) {
        console.error("Error uploading document: ", error);
      }
    }
  } else {
   
    const currentLength = form.value.documentsUrl.length;
    const newDocumentsUrl = form.value.documents.map(() => ({
      url: '',
      loading: true,
      docid: createRandomString(20) 
    }));


    form.value.documentsUrl = form.value.documentsUrl.concat(newDocumentsUrl);

    for (let i = 0; i < form.value.documents.length; i++) {
      try {
        const docid = form.value.documentsUrl[i].docid;
        const file = form.value.documents[i];
        const fileRef = storageRef(storage, `${form.value.projectId}/document${docid}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        form.value.documentsUrl[i].url = url;
        form.value.documentsUrl[i].loading = false;
      } catch (error) {
        console.error("Error uploading document: ", error);
      }
    }
  }
}


function handleSelectedFile(file){
  project.value.projectThumbnail = file;
  form.value.thumbnail1Url = file;
}


function handleSelectedFile2(file){
  project.value.projectAboutImage = file;
  form.value.thumbnail2Url = file;
}

async function removeImage(id) {
  try {
    
    const response = await fetch(`/api/document/update/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        docid: id,  
      },
    });

    
    const { projectImages } = await response.json();

   
    form.value.documentsUrl = projectImages.map((ele)=>{
    return {
      url:ele.urlstring,
      loading:false,
      docid:ele.docid

    }
  }) 
  
    project.value.projectImages = projectImages; 
  } catch (error) {
    console.error("Error removing image:", error);
  }
}


function openDialog(){

 form.value.projectId=project.value.projectId,
 form.value.projectTitle= project.value.projectTitle,
 form.value.clientName= project.value.projectClient,
 form.value.projectAddress=project.value.projectAddress,
 form.value.projectDescription=project.value.projectDescription,
 form.value.projectType=project.value.projectType,
 form.value.projectRating=project.value.projectRating,
 form.value.thumbnail1=project.value.projectThumbnail,
 form.value.thumbnail2=project.value.projectAboutImage,
 form.value.thumbnail1Url=project.value.projectThumbnail,
 form.value.thumbnail2Url=project.value.projectAboutImage,
 form.value.documents=[],
 form.value.documentsUrl=project.value.projectImages.map((ele)=>{
    return {
      url:ele.urlstring,
      loading:false,
      docid:ele.docid

    }
  })

  dialog.value = true;

}







</script>

<style scoped>
.custom-layout {
  height: 100vh;
  background-color: black; 
  color: white;
}

.text-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-content {
  padding: 40px;
}

.project-title {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 5px;
}

.project-subtitle {
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 30px;
}

.company-name {
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 50px;
}

.features {
  margin-top: 50px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.feature-item v-icon {
  font-size: 24px;
}

.image-section .project-image {
  object-fit: cover;
  height: 100%;
}



.custom-card {
  width: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  background-color: #1e1e1e; 
  color: #fff; 
}

.v-card-title {
  background-color: #6200ea;
  color: white;
  padding: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.v-card-subtitle {
  color: #b3b3b3; 
}



.v-text-field input,
.v-select input {
  color: #fff; 
}





.v-card-actions {
  justify-content: space-between;
}

.image-container {
  position: relative;
  display: inline-block;
  width: 100%; /* Ensure the image takes full width of the container */
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: red;
  background-color: white;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  z-index: 10;
}

.v-img {
  border-radius: 4px;
  object-fit: cover;
}

</style>

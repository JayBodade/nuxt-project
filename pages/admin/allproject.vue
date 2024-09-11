<template>
  <div class="mt-2 pa-4" >
    <v-row class="d-flex justify-end mb-3">
  <v-col cols="auto" >
    <v-btn class="mr-3" @click="openDialog"><v-icon>
      mdi-plus
    </v-icon></v-btn>
  </v-col>
</v-row>
   
  <v-row class="mb-3" no-gutters justify="start" align="start">
  <v-col
    cols="auto"
    v-for="project in allprojects"
    :key="project._id"
  >
    <product @removeProject="removeProject" path="/admin/project" :projectItem="project"></product>
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

          <file-input  photoType="thumbnail1" header="Thumbnail 1" @selectFile="handleSelectedFile" :file="form.thumbnail1" :projectId="form.projectId" />
          <!-- File Inputs -->
          <file-input photoType="thumbnail2" header="Thumbnail 2" @selectFile="handleSelectedFile2"  :file="form.thumbnail2" :projectId="form.projectId"/>



          <span class="mt-2 mb-1">Upload Multiple</span>
          <v-file-input
            label="Upload Documents (Multiple)"
            v-model="form.documents"
            accept="image/*"
            multiple
            @update:modelValue="uploadAllSelectDocuments"
            prepend-icon=""
            variant="outlined"
            prepend-inner-icon="mdi-file-document"
            class="custom-input mt-2"
          ></v-file-input>
          <v-row>
    <v-col v-for="(doc, index) in form.documentsUrl" :key="index" class="image-container">
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
          <v-btn  color="white" class="mt-2 mx-auto"  block variant="elevated" @click="resetForm" >Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    </v-dialog>
   
  </div>
</template>

<script setup>
import {ref as storageRef, getDownloadURL,uploadBytes,deleteObject } from 'firebase/storage';
import { ref } from 'vue';
const storage = useFirebaseClient();
const form = ref({
  
  projectTitle: 'Test Project n',
  clientName: 'Test Project n',
  projectAddress: 'Test Project n',
  projectDescription: 'Test Project n',
  projectType: '',
  projectRating:0,
  thumbnail1: null,
  thumbnail2: null,
  thumbnail1Url:null,
  thumbnail2Url:null,
  documents: null,
  documentsUrl:[]
});

let loading = ref(false);

let dialog = ref(false);

function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function submitForm() {
  try{
    loading.value = true;
    console.log(form.value);
    const response = await fetch('/api/addproject',{
      method:'POST',
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify(form.value)
    })

    const result = await response.json();

    console.log(result)
    allprojects.value.push(result);
  }catch(e){
    console.log("something went wrong",e);
  }finally{
    loading.value = false;
   dialog.value = false; 
  }
}

function resetForm() {
  form.value = {
    projectId:'',
    projectTitle: 'Test Project n',
    clientName: 'Test Project n',
    projectAddress: 'Test Project n',
    projectDescription: 'Test Project n',
    projectType: '',
    thumbnail1: null,
    thumbnail2: null,
    documents: null
  };
}

let docLoading = ref(false);

async function uploadAllSelectDocuments() {
 

  if (!form.value.documentsUrl.length) {
    
    form.value.documentsUrl = form.value.documents.map(() => ({
      url: '',
      loading: true,
      docid: createRandomString(20) 
    }));

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
        const docid = form.value.documentsUrl[currentLength + i].docid;
        const file = form.value.documents[i];
        const fileRef = storageRef(storage, `${form.value.projectId}/document${docid}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        form.value.documentsUrl[currentLength + i].url = url;
        form.value.documentsUrl[currentLength + i].loading = false;
      } catch (error) {
        console.error("Error uploading document: ", error);
      }
    }
  }
}


function handleSelectedFile(file){
  form.value.thumbnail1 = file;
  form.value.thumbnail1Url = file;
  
}

function handleSelectedFile2(file){
  form.value.thumbnail2 = file;
  form.value.thumbnail2Url = file;
}

function openDialog(){
  form.value.projectId = createRandomString(20);
  dialog.value = true;
}

async function removeImage(id){
  const fileRef = storageRef(storage, `${form.value.projectId}/document${id}`);
  try {
    await deleteObject(fileRef);
    form.value.documentsUrl = form.value.documentsUrl.filter(doc => doc.docid !== id);
  } catch (error) {
    console.error("Error deleting image:", error);
  }

}

function removeProject(id){
  allprojects.value = allprojects.value.filter((project)=>project._id != id);
}

const {data:allprojects} = await useFetch('/api/getAllProjects')
</script>

<style scoped>

.form-container {
  background-color: #000;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 100px;
  height: 100px;
}

.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 2px;
  z-index: 10;
}

.v-img, .v-skeleton-loader {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>

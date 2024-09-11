<template>
  <div class="form-container">
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
          <v-file-input
            label="Upload Thumbnail 1"
            v-model="form.thumbnail1"
            accept="image/*"
           variant="outlined"
           prepend-icon=""
            prepend-inner-icon="mdi-camera"
            class="custom-input mt-2"
          ></v-file-input>

          <v-file-input
            label="Upload Thumbnail 2"
            v-model="form.thumbnail2"
            accept="image/*"
           variant="outlined"
           prepend-icon=""
            prepend-inner-icon="mdi-camera"
            class="custom-input mt-2"
          ></v-file-input>

          <v-file-input
            label="Upload Documents (Multiple)"
            v-model="form.documents"
            accept="image/*"
            multiple
            prepend-icon=""
            variant="outlined"
            prepend-inner-icon="mdi-file-document"
            class="custom-input mt-2"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="d-flex justify-center flex-column">
          <v-btn color="white" class="mt-2 mx-auto" block variant="elevated" @click="submitForm" >Submit</v-btn>
          <v-btn  color="white" class="mt-2 mx-auto"  block variant="elevated" @click="resetForm" >Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const app = useFirebaseClient();
const form = ref({
  projectTitle: 'Test Project n',
  clientName: 'Test Project n',
  projectAddress: 'Test Project n',
  projectDescription: 'Test Project n',
  projectType: '',
  thumbnail1: null,
  thumbnail2: null,
  thumbnail1Url:null,
  thumbnail2Url:null,
  documents: null,
  documentsUrl:[]
});

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

    form.value.folderId = createRandomString(20);
    //create a folder of this in firebase 
   const storage = app.storage();
   const storageRef = storage.ref(`${form.value.folderId}/`);



   const uploadThumbnail1 = storageRef.child('thumbnail1/').put(form.value.thumbnail1);
   const snapshot1 = await uploadThumbnail1;
   form.value.thumbnail1Url = await snapshot1.ref.getDownloadURL();
 console.log(form.value);

   const uploadThumbnail2 = storageRef.child('thumbnail2/').put(form.value.thumbnail2);
   const snapshot2 = await uploadThumbnail2;
   form.value.thumbnail2Url = await snapshot2.ref.getDownloadURL();
   console.log(form.value);

   for(let i=0;i<form.value.documents.length;i++){
    const uploadDocuments = storageRef.child(`document${i}`).put(form.value.documents[i]);
    const snapshot = await uploadDocuments;
    let documentUrl = await snapshot.ref.getDownloadURL();
    form.value.documentsUrl.push(documentUrl);
    console.log(documentUrl);
   }
 
   
    const response = await fetch('/api/addproject',{
      method:'POST',
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify(form.value)
    })

    const result = await response.json();

    console.log(result)
  }catch(e){
    console.log("something went wrong",e);
  }
}

function resetForm() {
  form.value = {
    folderId:'',
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
</style>

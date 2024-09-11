<template>
  <div class="mt-4"> 
    <span>{{header}}</span>
   <div v-if="nativeFile">

    <v-row >
      <v-col cols="8" class="mt-4">
        <div class="file-box">
        <span class="file-text">{{ nativeFile?.name || nativeFile }}</span>
        <v-icon @click="clearFile">mdi-close</v-icon>
      </div>
      </v-col>
      <v-col cols="4">
        <v-img height="100px" v-if="!loading" :src="nativeFile">
        </v-img>
        <v-progress-circular v-else
        class="mt-2"
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
</v-col>
    </v-row>
   </div>
   <div v-else>
    <v-file-input
            :label="`Upload ${header} `"
            v-model="nativeFile"
            accept="image/*"
           variant="outlined"
           prepend-icon=""
           @update:modelValue="createFile"
            prepend-inner-icon="mdi-camera"
            class="custom-input mt-2"
          ></v-file-input>

   </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
const storage = useFirebaseClient();

let imgUrl = ref(null);
let loading = ref(false);
const {file,photoType,projectId,header} = defineProps(['file','photoType','projectId','header'])
let nativeFile = ref(file);
const emit = defineEmits(['clearFile','selectFile'])
async function clearFile(){

  try{
  const fileRef = storageRef(storage,`${projectId}/${photoType}`);
  await deleteObject(fileRef);
  nativeFile.value = null;
  emit('clearFile');
  }catch(e){
    console.log("Something went wrong",e);
  }

}



// async function createFile(){
//   if(nativeFile){
//     loading.value = true;
//     console.log("this is ",photoType,projectId);
//     // const storageFirebase = storage();
//    const storageRef = storage.ref(`${projectId}/`);

//   const uploadThumbnail1 = storageRef.child(`${photoType}/`).put(nativeFile.value);
//    const snapshot1 = await uploadThumbnail1;
//    let url  = await snapshot1.ref.getDownloadURL();
//   nativeFile.value = url;
//    emit('selectFile',url);
//    loading.value = false;

//   }
  

// }

async function createFile(){
  try{
  
  if(nativeFile){
    loading.value = true;
    const fileRef = storageRef(storage,`${projectId}/${photoType}`);
    await uploadBytes(fileRef,nativeFile.value);
    const url = await getDownloadURL(fileRef);
    nativeFile.value = url;
    emit('selectFile',url);

  }
}catch(e){
  console.log("Something went wrong",e);
}finally{
  loading.value = false;
}
}


</script>

<style>
.file-box {
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
  overflow: hidden; /* Ensure content does not overflow */
  white-space: nowrap; /* Prevent text from wrapping */
  height: 50px; /* Set a fixed height */
}

.file-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis; /* Show ellipsis if text overflows */
  margin-right: 8px; /* Add space between text and icon */
}

.v-icon {
  cursor: pointer;
  margin-left: 8px;
}
</style>
<template>

  <v-card @mouseover="isHovering=true" @mouseleave="isHovering=false" class="custom-card" max-width="320" elevation="0">
          <v-btn v-if="isHovering && route.fullPath.includes('/admin')" @click="removeProject(projectItem._id)" style="position: absolute;right: 2px;top:4px; z-index: 1;" icon><v-icon>mdi-close</v-icon></v-btn>
  <v-img
    :src="projectItem.projectThumbnail"
    class="rounded-img"
    height="400px"
    cover
  >
  <NuxtLink :to="`${path}/${projectItem._id}`"><v-card-actions class="card-content overlay-content">
      <div>
        <h3 class="card-title">{{ projectItem.projectTitle }}</h3>
        <v-row class="align-center mt-1">
          <v-icon size="small" color="white" class="mr-1">mdi-map-marker</v-icon>
          <span class="card-subtitle">{{ projectItem.projectAddress }}</span>
        </v-row>
      </div>
      
      <v-btn icon class="action-btn">
        <v-icon color="white">mdi-arrow-top-right</v-icon>
      </v-btn>
    </v-card-actions></NuxtLink>
  </v-img>
</v-card>

     

</template>

<script  setup>
const emit = defineEmits(['removeProject'])
const route = useRoute();
const project = defineProps(['projectItem','path']);

let isHovering = ref(false);
async function removeProject(id){
 try{

  const respone = await fetch(`/api/product/delete/${id}`,{
    method:"DELETE",
    headers:{
      'Content-type':'application/json',
    }
  })

  const result = await respone.json();
  if(result.success){
    emit('removeProject',id);
  }

 }catch(e){
  console.log("something went wrong",e);
 }
}

</script>

<style scoped>
.custom-card {
  position: relative;
  margin-bottom: 10px;
  margin-right: 10px;
}

.overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
  color: white;
  padding: 16px;
}

.rounded-img {
  border-radius: 20px;
}

.card-content {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:black;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.card-subtitle {
  font-size: 14px;
  color: white;
}

.action-btn {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
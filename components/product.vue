<template>
 <v-card class="custom-card" max-width="380"  elevation="0">
      
  
      <v-img
        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914" 
        class="rounded-img"
        height="100%"
      >
      
        <v-card-actions class="card-content">
          <div>
            <h3 class="card-title">{{ project.projectItem.projectTitle }}</h3>
            <v-row class="align-center">
              <v-icon size="small" color="white" class="mr-1">mdi-map-marker</v-icon>
              <span class="card-subtitle">{{project.projectItem.projectAddress}}</span>
            </v-row>
          </div>
         
          <v-btn icon class="action-btn">
            <v-icon color="white">mdi-arrow-top-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-img>
    </v-card>
</template>

<script  setup>

const project = defineProps(['projectItem']);

</script>

<style scoped>
.custom-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
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
<template>
  <div>
    this is about page
  <input type="file" :v-model="image" accept="image/*" >
    <button @click="uploadSelectedFile">
   Upload File
    </button>
  </div>
</template>

<script  setup>


let image = ref(null);
function uploadSelectedFile(){

}

</script>

<style>

</style>
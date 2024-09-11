// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  plugins: ['~/plugins/vuetify.js'],
  build: {
    transpile: ['vuetify'],
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css', // Import MDI CSS here
  ],
  modules: ['@pinia/nuxt'],
  runtimeConfig:{
    dbUrl : process.env.DB_URL 
  },
  routeRules:{
    '/': { isr: true },
    '/about':{prerender:true},
    '/contact/': { ssr: false },
  },

  hooks:{
    async "prerender:routes" (ctx){
      let projects = await fetch('http://localhost:3000/api/getAllProjects');
      const result = await projects.json();

      result.forEach((item:any)=>{
        ctx.routes.add(`/project/${item._id}`);
        // ctx.routes.add(`/admin/project/${item._id}`);
      })
    }  
  }
  

})

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
    dbUrl : process.env.DB_URL,
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
    }
    
  },
  routeRules:{
   '/': { isr: true },  
   '/projects':{isr:true},
    '/about': { prerender: true },  
    '/contact': { ssr: false },  
    '/admin/allproject': { ssr: false }, 
    '/admin/project/**':{ssr:false},
  },

  hooks:{
    async "prerender:routes" (ctx){
      let projects = await fetch('https://nuxt-project-sandy.vercel.app/api/getAllProjects');
      const result = await projects.json();

      result.forEach((item:any)=>{
        ctx.routes.add(`/project/${item._id}`);
      })
    }  
  },
  nitro:{
    compressPublicAssets:true,
  }
  

})

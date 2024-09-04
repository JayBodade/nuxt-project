import mongoose from "mongoose"
export default defineNitroPlugin((nitroApp) => {
  const url = process.env.DB_URL;
  mongoose.connect(url).then(()=>{
    console.log("connected to database");
  }).catch((e)=>{
    console.log("something went wrong");
  })
})

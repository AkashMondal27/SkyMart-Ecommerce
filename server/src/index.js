import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from './app.js'

dotenv.config({
    path: "./.env"
})



connectDB() 


// in dp we use async method which return some .then .catch
.then(()=>{
    app.listen(process.env.PORT || 5000 ,()=>{
        console.log(`Server is running at http://localhost:${process.env.PORT}`)
    })


    app.on("error", (error) => {
      console.error("❌ Application could not talk to the database:", error);
      throw error;
    })
})

.catch((err)=>{
   console.log("mongpDB connection failed !" , err)
})

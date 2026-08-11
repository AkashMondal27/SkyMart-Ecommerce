import express from "express";

const app = express();


//setting to get different types of data --Json , Url , public files
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))   //store file store in my server 

// Routes import
import userRouter from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
    res.send("SkyMart API is running successfully 🚀");
});

export default app;
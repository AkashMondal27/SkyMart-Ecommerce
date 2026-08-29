import express from "express";
import cors from "cors"

const app = express();

// CORS
app.use(cors({
    origin: "http://localhost:5173", // your React frontend
    credentials: true
}));


//setting to get different types of data --Json , Url , public files
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))   //store file store in my server 

// Routes import
import userRouter from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"
import adddessRoutes from "./routes/address.routes.js"
import orderRoutes from "./routes/order.routes.js";
import statsRoutes from "./routes/stats.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/address", adddessRoutes)
app.use("/api/v1/order", orderRoutes)
app.use("/api/v1/stats", statsRoutes);



app.get("/", (req, res) => {
    res.send("SkyCart API is running successfully 🚀");
});



//  GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {

    return res.status(err.statuscode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        data: null,
        error: err.error || []
    });

});

export default app;
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB database is connected succesfully !! \n db host :${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection failed :  ", error);
        process.exit(1)
    }
}

export default connectDB;

import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME} from "../constant.js";
dotenv.config();

const connectDB = async () => {
    try {
        const dbConnectionInstance =await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("connection success: running on port:",dbConnectionInstance.connection.host,":",dbConnectionInstance.connection.port,"/",dbConnectionInstance.connection.name);
        
    } catch (error) {
        console.log("error from db.js file in db connection error:",error);
        
    }
   }

   export default connectDB;
   
  
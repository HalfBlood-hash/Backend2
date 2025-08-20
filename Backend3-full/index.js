

import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/db/db.js";

dotenv.config({
    path: './.env'
});

connectDB();
// const app = express();

// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         console.log(`\n MongoDB connected !! DB HOST: ${mongoose.connection.host}`);

//         app.on("error", (error) => {
//             console.error("EXPRESS ERROR: ", error);
//         })

//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is running at port : ${process.env.PORT || 8000}`);
//         })
//     } catch (error) {
//         console.error("MONGODB connection FAILED: ", error);
//         process.exit(1);
//     }
// })()


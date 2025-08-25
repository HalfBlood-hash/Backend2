
import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
const app =express()

app.use(cors({
    origin:process.env.CORS,

    credentials:true

}))
// get the data from json like when we submit form and set limit 
app.use(express.json({limit:"10kb"}))

// get data from url  and here extended true mean we can send nested object
app.use(express.urlencoded({extended:true,limit:"10kb"}))
// to store some image and pdf locally
app.use(express.static("public"))
app.use(cookieParser)

export {app}
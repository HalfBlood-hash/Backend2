const express = require('express');

const app=express();
const port =process.env.PORT || 3000;


// in forntend  npm run build and past the build file here whenever u want to 
// make some change in forntend we have to do same process again copy and past 
// by this process

app.use(express.static('dist')) 

app.get('/',(req,res)=>{
    res.send("home page backend 2")
})
app.get('/api/jokes',(req,res)=>{
    const jokes=[
        {
            id:"1",
            title:"joke 1",
            content:"joke content 1"

        },
        {
            id:"2",
            title:"joke 2",
            content:"joke content 2"

        },
        {
            id:"3",
            title:"joke 3",
            content:"joke content 3"

        },
        {
            id:"4",
            title:"joke 4",
            content:"joke content 4"

        },
        {
            id:"5",
            title:"joke 5",
            content:"joke content 5"

        }

    ]
    res.send(jokes);
})
app.listen(port,()=>{
    console.log("Running on port:" + port);
})
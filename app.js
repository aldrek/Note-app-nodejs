const mongoose = require('mongoose')
const express = require('express')
const userRouter = require('./routes/user')
const User = require('./models/user');
require('dotenv').config()

const app = express()

const port = process.env.PORT;

// Register routers
app.use( '/users' , userRouter)

mongoose.connect( process.env.SERVER , { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database connected")
}).catch(()=>{
    console.log("Database fail to connect")
})

app.use('/' , function(req , res){
    res.send('Hello World')
})

// This method will be called before any request
app.use( (req , res , next) => {
    console.log(req.method, req.path)
    next()
})

app.listen(process.env.PORT | 3000, () => {
    console.log(`Server Has Started`);
})
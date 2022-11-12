const mongoose = require('mongoose')
const express = require('express')

const User = require('./models/user');
const Note = require('./models/user');

const userRouter = require('./routes/user')
const noteRouter = require('./routes/note');
const note = require('./models/note');

const helmet = require("helmet");

var morgan = require('morgan')

require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: true}))
app.use(helmet());

mongoose.Promise = global.Promise

const port = process.env.PORT;

// Register routers
app.use('/user', userRouter)
app.use('/note', noteRouter)

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
}).catch(() => {
    console.log("Database fail to connect")
})

// This method will be called before any request
const loggerMiddleware = (req, res, next) => {
    console.log('New request to: ' + req.method + ' ' + req.path)
    next()
}

var isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
    morgan('tiny')
}

// app.use(loggerMiddleware)

app.listen(process.env.PORT || 3000 , () => {
    console.log(`Server Has Started`);
})
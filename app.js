const mongoose = require('mongoose')
const express = require('express')

const User = require('./models/user');
const Note = require('./models/user');

const userRouter = require('./routes/user')
const noteRouter = require('./routes/note');
const note = require('./models/note');

var morgan = require('morgan')

require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: true}))

mongoose.Promise = global.Promise
// app.use(morgan('combined'))

const port = process.env.PORT;

// Register routers
app.use('/user', userRouter)
app.use('/note', noteRouter)

app.use(morgan('combined'))

mongoose.connect(process.env.SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
}).catch(() => {
    console.log("Database fail to connect")
})

// // This method will be called before any request
// const loggerMiddleware = (req, res, next) => {
//     console.log('New request to: ' + req.method + ' ' + req.path)
//     next()
// }

// app.use(loggerMiddleware)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Has Started`);
})
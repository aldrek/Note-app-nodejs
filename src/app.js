const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/user");
const Note = require("./models/user");
const passport = require("passport");

const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
const note = require("./models/note");

const session = require("express-session");
const connection = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

// app.use(morgan("combined"));

mongoose.Promise = global.Promise;

// Register routers
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.use(passport.initialize());
app.use(passport.session());

// Connection to mongodb
(async () => await connection())();

// This method will be called before any request
const loggerMiddleware = (req, res, next) => {
  console.log("New request to: " + req.method + " " + req.path);
  next();
};

// new User({
//     fullname: "Fake",
//     email: "aa@ss.com",
//     password: "123123123"
// }).save()

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Has Started`);
});

const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/user");
const Note = require("./models/user");

const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");
const note = require("./models/note");

const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("combined"));

mongoose.Promise = global.Promise;

// Register routers
app.use("/user", userRouter);
app.use("/note", noteRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err.reason));

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

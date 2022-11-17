const mongoose = require("mongoose");
const validator = require("validator");
var bcrypt = require("bcryptjs");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const Note = require("./note");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    bio: {
      type: String,
      default: "",
    },
    access_token: {
      type: String,
      default: "",
    },
    modified: {
      type: Date,
      default: Date.now(),
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
    activeFlag: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "user",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("notes", {
  ref: "note",
  localField: "_id",
  foreignField: "owner",
});

// funtion to hash passaword using genSaltSync and hashSync
userSchema.methods.hashPassword = function () {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(this.password, salt);
};

// Check if password matches the value from db
userSchema.methods.checkPassword = function (password) {
  const userPassword = this.password;
  return bcrypt.compareSync(password, userPassword);
};

userSchema.methods.logoutUser = async function (req) {
  const newTokens = req.user.tokens.filter((t) => t.token !== req.token);

  await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
};

userSchema.methods.generateAuthToken = async function () {
  let user = this;

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  user.tokens = user.tokens.concat({ token: token });

  await user.save();

  user.access_token = token;
  // It should be like this
  //user.test = token

  return token;
};

// Showing the data object without password value
userSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.tokens;
  delete obj.password;
  delete obj.__v;
  delete obj.avatar;

  return obj;
};

userSchema.statics.updateUser = async (req, res, isAdmin) => {
  const user = req.user;

  let avatar = req.file;

  const userId = isAdmin === true ? req.params.uid : user._id;

  const newUser = await User.findByIdAndUpdate(
    userId,
    {
      bio: req.body.bio,
      fullname: req.body.fullname,
    },
    { new: true }
  );

  if (avatar) {
    newUser.avatar = req.file.buffer;
    await newUser.save();
  } else {
    console.log("No Avatar Found");
  }

  if (!newUser)
    res.json({
      status: false,
      message: "Something went wrong",
    });

  res.json({
    status: true,
    message: "Success",
    data: newUser,
  });
};

userSchema.statics.deleteUser = async (req, res, isAdmin) => {
  const user = req.user;

  const userId = isAdmin === true ? req.params.uid : user._id;

  let check = false;

  // Deleting user while have admin roles with isHardDelete= true mean that the user will be deleted forever and thier notes too
  if (isAdmin && req.body.isSoftDelete === "false") {
    // Delete user by [uid] and the pre delete method gets called

    await Note.deleteMany({ owner: userId });
    check = await User.findByIdAndRemove({ _id: userId });
  } else {
    if (!isAdmin) {
      // logout user
      user.logoutUser(req);
    }

    // Delete user
    check = await User.updateOne({ _id: userId }, { activeFlag: false });
  }

  if (!check)
    res.json({
      status: false,
      message: "Something went wrong",
    });

  res.json({
    status: true,
    message: "Success",
  });
};

const User = mongoose.model("user", userSchema);
module.exports = User;

const express = require("express");
const mongoose = require("mongoose");
var userController = {};
const User = require("../models/user");
const Note = require("../models/note");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

// return user info
userController.getUserInfo = (req, res) => {
  res.json({
    status: true,
    message: "Success",
    data: req.user,
  });
};

// return the authenticated info
userController.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //if user not exist than return status 400
  if (!user || !user.activeFlag)
    return res.status(400).json({ error: "User not exist" });
  else {
    // Check password
    const check = await user.checkPassword(password);
    if (check) {
      // Generate token
      await user.generateAuthToken();
      res.send({
        data: user,
      });
    } else {
      return res.status(400).json({ error: "Password not correct" });
    }
  }
};

userController.refresh = async (req, res) => {
  // Check if the user has this refresh token
  // Generate one refresh token and delete the sent one

  try {
    let user = req.user;
    let result = req.user.refresh_tokens.filter((token) => {
      return req.refresh_token.indexOf(token.refresh_token) !== -1;
    });

    if (req.refresh_token && result != null) {
      // Generate new access token for user

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_LIFE,
      });

      const refresh = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );

      // Append tokens
      user.acesss_tokens = user.tokens.concat({ acesss_token: token });
      user.refresh_tokens = user.refresh_tokens.concat({
        refresh_token: refresh,
      });

      console.log(token);

      await user.save();
      user.acesss_token = token;
      user.refresh_token = refresh;

      res.send({
        data: user,
      });
    } else {
      res.status(500).json({
        status: "false ",
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      status: "false ",
    });
  }
};

// Create user info
// Todo : validate all fields then add image to user
userController.register = async (req, res) => {
  try {
    const user = new User(req.body);
    user.password = user.hashPassword();
    await user.save();

    if (user) {
      res.send({
        status: true,
        data: user,
      });
    } else {
      res.status(500).send("Something went wrong");
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).send(Object.values(err.errors).map((val) => val.message));
    } else {
      res.status(500).send(err);
    }
  }
};

// Logout user by deleting token from user's data
userController.logout = async (req, res) => {
  const userToken = req.token;

  await req.user.logoutUser(req);

  res.json({
    status: "true",
    message: "Logout completed",
  });
};

// Edit user by [id]
userController.editUser = async (req, res) => {
  User.updateUser(req, res);
};

// Delete user by [id]
userController.deleteUser = async (req, res) => {
  User.deleteUser(req, res, req.user.isAdmin);
};

//////////// Admin ////////////
// Admin edits any user by [id]
// TODO:

userController.editAnyUser = async (req, res) => {
  User.updateUser(req, res, req.user.isAdmin);
};

// return all users for admin that has (Pagination, sort, filtering)
userController.getAnyOrAllUsers = async (req, res) => {
  const { sort, page, limit, age } = req.query;

  let users = await User.find({ age: { $gt: age - 1 } })
    .limit(limit)
    .skip(limit * page)
    .sort({ created_at: -1 })
    .exec();
  const count = await User.countDocuments();

  // Exculde current user from array
  users = users.filter(
    (item) => item._id.toString() !== req.user._id.toString()
  );

  res.json({
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: users,
  });
};

// Admin deletes user
userController.deleteAnyUsers = (req, res) => {
  User.deleteUser(req, res, req.user.isAdmin);
};

module.exports = userController;

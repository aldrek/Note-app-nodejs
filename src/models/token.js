const crypto = require("crypto");
const mongoose = require("mongoose");
const { token } = require("morgan");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;

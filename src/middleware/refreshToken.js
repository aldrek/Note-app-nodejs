const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    // Fetch token then check if it's jwt valid stuture
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // Exract userId from token
    const userId = decodedToken._id;

    // Check if this userId from token is the same

    const user = await User.findOne({
      _id: /*decodedToken._id*/ userId,
      "refresh_tokens.refresh_token": token,
    });

    if (!user)
      res.status(401).json({ success: false, message: "Unauthorized access!" });

    req.user = user;
    req.refresh_token = token;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: "Unauthorized access!",
    });
  }
};

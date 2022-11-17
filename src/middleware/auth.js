const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Check if the api_key matches server's key then checks if token exits or not
// case :
// Exist -> Go next
// Not exist -> return 401
module.exports = async (req, res, next) => {
  try {
    // Fetch token then check if it's jwt valid stuture
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Exract userId from token
    const userId = decodedToken._id;

    // Check if this userId from token is the same

    const user = await User.findOne({
      _id: /*decodedToken._id*/ userId,
      "tokens.token": token,
    });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });

    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: "Unauthorized access!",
    });
  }
};

const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const userController = require("../controllers/userController");
const userAuth = require("../middleware/auth");
const refreshToken = require("../middleware/refreshToken");
const apiAuth = require("../middleware/apiAuth");
const adminAuth = require("../middleware/adminAuth");
const passport = require("passport");
require("../utils/GoogleAuth")(passport);
const twitter = require("../utils/TwitterAuth");
const multer = require("multer");
const upload = multer();

router.get("/", async function (req, res) {
  const users = await Users.find({});
  res.send({
    users,
  });
});

router.get(
  "/admin/list",
  apiAuth,
  userAuth,
  adminAuth,
  userController.getAnyOrAllUsers
);
router.delete(
  "/admin/:uid",
  apiAuth,
  userAuth,
  adminAuth,
  userController.deleteAnyUsers
);
router.put(
  "/admin/edit/:uid",
  apiAuth,
  userAuth,
  adminAuth,
  userController.editAnyUser
);

router.post("/register", apiAuth, userController.register);
router.post("/login", apiAuth, userController.login);
router.post("/refresh", apiAuth, refreshToken, userController.refresh);
router.get("/me", apiAuth, userAuth, userController.getUserInfo);
router.put(
  "/edit/:uid",
  apiAuth,
  userAuth,
  upload.single("avatar"),
  userController.editUser,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete("/me", apiAuth, userAuth, userController.deleteUser);
router.post("/logout", apiAuth, userAuth, userController.logout);
router.post(
  "/changePassword",
  apiAuth,
  userAuth,
  userController.changePassword
);
router.post(
  "/checkVerifyCode/:id/:token",
  apiAuth,
  userAuth,
  userController.checkVerifyCode
);

router.post(
  "/sendVerifyCode",
  apiAuth,
  userAuth,
  userController.sendVerifyCode
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.user);
    // res.redirect("/profile");
  }
);

router.get("/auth/twitter", passport.authenticate("twitter"));
router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;

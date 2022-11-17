const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const userController = require("../controllers/userController");
const userAuth = require("../middleware/auth");
const apiAuth = require("../middleware/apiAuth");
const adminAuth = require("../middleware/adminAuth");

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

module.exports = router;

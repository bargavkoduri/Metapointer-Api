const { Router } = require("express");
const router = Router();
const LoginController = require("../controllers/login.controller");

router.post(
  "/",
  (req, res, next) => {
    if (req.body && req.body.phoneNumber && req.body.password) next();
    else res.sendStatus(400);
  },
  LoginController.login
);

module.exports = router
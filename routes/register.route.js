const { Router } = require("express");
const router = Router();
const RegisterController = require("../controllers/register.controller");

router.post(
  "/",
  (req, res, next) => {
    if (req.body && req.body.phoneNumber && req.body.password) next();
    else res.sendStatus(400);
  },
  RegisterController.register
);

module.exports = router;
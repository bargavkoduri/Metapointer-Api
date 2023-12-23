const { Router } = require("express");
const router = Router();
const {checkValidUser,checkValidToken} = require("../utils/jwt")
const UserController = require("../controllers/user.controller")

// Checks for authenticated and valid user token
router.use(checkValidToken)
router.use("/:id",checkValidUser)

// To get info of user
router.get("/:id",UserController.getInfo)

// To get successful transactions of a user
router.get("/:id/transactions",UserController.getTransactions)

// To process transaction
router.post("/:id/process-transaction",UserController.processTransaction)

module.exports = router
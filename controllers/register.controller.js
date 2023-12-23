const User = require("../models/User.model")
const { hashPassword } = require("../utils/bcrypt")

exports.register = async (req,res) => {
    try {
        req.body.password = hashPassword(req.body.password)
        const newUser = new User(req.body)
        await newUser.save()
        res.sendStatus(201)
    } catch(err) {
        res.status(500).send({
          msg: "Unable to process request"
        })
    }
}
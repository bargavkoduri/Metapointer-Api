const User = require("../models/User.model")
const {comparePassword} = require("../utils/bcrypt")
const {generateToken} = require("../utils/jwt")

const invalidLoginCred = (res) => {
    res.status(401).send({
        err: "Invalid Login Credentials",
    })
}

const validLoginCred = (req,res,user) => {
    let details = {
        _id : user._id,
        phoneNumber: req.body.phoneNumber
    }
    let jwtToken = generateToken(details)
    details.jwtToken = jwtToken
    res.status(200).send(details)
}

exports.login = async (req,res) => {
    try {
        let user = await User.findOne(
            { phoneNumber : req.body.phoneNumber },
            { password: 1 }
        )
        if(user) {
            if(comparePassword(req.body.password,user.password)){
                validLoginCred(req,res,user)
            } else {
                invalidLoginCred(res)
            }
        }
    } catch(err) {
        res.status(500).send({
            msg : "Unable to process request"
        })
    }
}
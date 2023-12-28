const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../constants")

const generateToken = (data) => {
    return jwt.sign(data,JWT_SECRET);
}

const checkValidToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token === null) res.sendStatus(401) // unauthorized
  else {
    jwt.verify(token, `${JWT_SECRET}`, (err, user) => {
      if (err) {
        res.sendStatus(403) // forbidden
      } else {
        req.user = user; // If valid jwt token sets a new field in request object as user and decrypted jwt token.
        next()
      }
    })
  }
}

const checkValidUser = (req,res,next) => {
  const {id} = req.params
  if(id === req.user._id)
    next()
  else {
    res.sendStatus(403)
  }
}

module.exports = {generateToken,checkValidToken,checkValidUser}
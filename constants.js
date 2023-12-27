require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET;
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = parseInt(process.env.REDIS_PORT)
const REDIS_PASSWORD  = process.env.REDIS_PASSWORD

module.exports = {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
};
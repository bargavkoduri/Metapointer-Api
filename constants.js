require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT
const SECRET_TOKEN = process.env.SECRET_TOKEN
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = parseInt(process.env.REDIS_PORT)
const REDIS_PASSWORD  = process.env.REDIS_PASSWORD

module.exports = {MONGO_URI,PORT,SECRET_TOKEN,REDIS_HOST,REDIS_PASSWORD,REDIS_PORT}
const redis = require("redis")
const {REDIS_HOST,REDIS_PASSWORD, REDIS_PORT} = require("../constants")

const client = redis.createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

function ConnectToRedis () {
    client.connect()
      .then(() => {
        console.log("Connected to Redis");
      })
      .catch((err) => {
        console.log(err.message);
      });
}

client.on('error',(err) => {
    ConnectToRedis()
})

ConnectToRedis()
module.exports = client
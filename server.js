const express = require("express");
const app = express();
const cors = require("cors");
const {connectDB} = require("./utils/db")
const { PORT } = require("./constants");

// cors middleware
app.use(cors());

// Bodyparser middleware
app.use(express.json());

// Connection to Database
connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT} `);
  });
})
.catch(() => {
})

// Import routes
const LoginRouter = require("./routes/login.route");
const RegisterRouter = require("./routes/register.route");
const UsersRouter = require("./routes/user.route");

// Use routes
app.use("/login", LoginRouter);
app.use("/register", RegisterRouter);
app.use("/users", UsersRouter);

// 404 path
app.use("*", (req, res) => {
  res.sendStatus(404);
});
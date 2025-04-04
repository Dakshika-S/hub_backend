const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser()); //to access req.cookie in auth route
app.get("/", (req, res) => {
  res.send("Welcome to Laundry hub");
});

const auth = require("./routes/authRoute");
const usrMgt = require("./routes/usrMgtRoute");
const package = require("./routes/packageRoute");
const orderRoute = require("./routes/orderRoute");

app.use("/api/v1/", auth);
app.use("/api/v1/", usrMgt);
app.use("/api/v1/", package);
app.use("/api/v1/", orderRoute);
app.use(errorMiddleware);
module.exports = app;

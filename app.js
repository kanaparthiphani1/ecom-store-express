const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const dummyRouter = require("./routers/dummy");
const userRouter = require("./routers/user");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(dummyRouter);
app.use("/api/v1", userRouter);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ message: err.message });
});

module.exports = app;

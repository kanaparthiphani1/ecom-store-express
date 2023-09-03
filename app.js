const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const dummyRouter = require("./routers/dummy");
const userRouter = require("./routers/user");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");

app.use(dummyRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ message: err.message });
});

module.exports = app;

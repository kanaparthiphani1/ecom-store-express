const mongoose = require("mongoose");

const connectWithDB = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
};

module.exports = connectWithDB;

const { bigPromise } = require("../middlewares/BigPromise");

exports.dummy = bigPromise((req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return next(new Error("no id"));
  }
  res.send("hello world");
});
// (req, res, next) => {
//     return Promise.resolve((req, res) => {
//         res.send("hello world");
//       })).catch(next);
//   };

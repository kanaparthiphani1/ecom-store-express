exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed for this resouce"));
    }
    next();
  };
};

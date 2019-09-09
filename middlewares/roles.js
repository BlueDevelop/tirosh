const isAdmin = (req, res, next) => {
  if (req.user.role != 1) {
    return res.status(403).send("User must be admin");
  } else {
    next();
  }
};

module.exports.isAdmin = isAdmin;

const mongoose = require("mongoose");
const passport = require("passport");
const router = require("express").Router();
const auth = require("../auth");
const Users = mongoose.model("Users");

router.get("/", (req, res, next) => {
  return res.status(200).json(req.user);
});

//POST new user route (optional, everyone has access)
router.post("/", (req, res, next) => {
  const {
    body: { user }
  } = req;
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }

  user.role = user.email == adminMail ? 1 : 0;

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.get("/login", (req, res, next) => {
  // const {
  //   body: { user }
  // } = req;
  // if (!user.email) {
  //   return res.status(422).json({
  //     errors: {
  //       email: "is required"
  //     }
  //   });
  // }
  // if (!user.password) {
  //   return res.status(422).json({
  //     errors: {
  //       password: "is required"
  //     }
  //   });
  // }
  // return passport.authenticate(
  //   "shraga",
  //   { session: true },
  //   (err, passportUser, info) => {
  //     console.log(passportUser);
  //     if (err) {
  //       return next(err);
  //     }
  //     if (passportUser) {
  //       const user = passportUser;
  //return res.json();
  return res.status(200).json(req.user);
  //     }
  //     return res.status(400).info;
  //   }
  // )(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get("/current", (req, res, next) => {
  const {
    payload: { id }
  } = req;

  return Users.findById(id).then(user => {
    if (!user) {
      return res.sendStatus(400);
    }

    return res.json({ user: user.toAuthJSON() });
  });
});

module.exports = router;

const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy } = require("passport-shraga");

const Users = mongoose.model("Users");
const admins = ["user1@example.com"];
let users = [];
// passport.use(new LocalStrategy({
//   usernameField: 'user[email]',
//   passwordField: 'user[password]',
// }, (email, password, done) => {
//   Users.findOne({ email })
//     .then((user) => {
//       if(!user || !user.validatePassword(password)) {
//         return done(null, false, { errors: { 'email or password': 'is invalid' } });
//       }

//       return done(null, user);
//     }).catch(done);
// }));
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  Users.findById(id, function(err, user) {
    cb(err, user);
  });
});

passport.use(
  new Strategy({ callbackURL: "/api/auth/callback" }, (profile, done) => {
    Users.findOne({ uniqueId: profile.id }).then(user => {
      if (!user) {
        let userToSave = new Users({
          uniqueId: profile.id,
          name: `${profile.name.firstName} ${profile.name.lastName}`
        });
        userToSave.role = admins.includes(profile.email) ? 1 : 0;
        userToSave.save();
      } else {
        console.log(user);
        user.uniqueId = profile.id;
        user.name = `${profile.name.firstName} ${profile.name.lastName}`;
        user.role = admins.includes(profile.email) ? 1 : 0;
        user.save();
      }
      return done(null, user);
    });
  })
);

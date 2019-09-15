const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");
const fileUpload = require("express-fileupload");
const passport = require("passport");

const striptags = require("striptags");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
const decodeEntities = entities.decode;

require("dotenv").config();

//Models & routes
require("./models/Users");
require("./models/Updates");
require("./models/Events");

const authRouter = require("./routes/api/auth");
const eventsRouter = require("./routes/api/events");
const filesRouter = require("./routes/api/files");
const updatesRouter = require("./routes/api/updates");
const usersRouter = require("./routes/api/users");

// Connection URL
const url = process.env.DB_ICU;
// Database Name
const dbName = process.env.DB_ICU_NAME;
const projectId = process.env.PROJECT_ID;

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";

//Initiate our app
const app = express();

require("./config/passport");

//Configure our app
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "passport",
    cookie: { maxAge: 7 * 24 * 60 * 60000 },
    resave: false,
    saveUninitialized: true
  })
);

if (!isProduction) {
  app.use(errorHandler());
}

// Use for upload files
app.use(
  fileUpload({
    useTempFiles: true,
    preserveExtension: true,
    createParentPath: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
//Configure Mongoose
mongoose.connect(process.env.DB_HOST);

//mongoose.set('debug', true);

// app.use(require("./routes"));
app.use("/api/auth", authRouter);
app.use((req, res, next) => {
  if (!req.user) res.redirect("/api/auth");
  else next();
});
app.use("/api/events", eventsRouter);
app.use("/api/files", filesRouter);
app.use("/api/users", usersRouter);
app.use("/api/updates", updatesRouter);

app.get("/isalive", (req, res) => {
  return res.status(200).send("alive");
});

app.get("/api/tasks", (req, res) => {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    const db = client.db(dbName);
    const collection = db.collection("tasks");
    const aggregation_array = [
      {
        $match: {
          project: new ObjectID(projectId),
          recycled: { $exists: false }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "assign",
          foreignField: "_id",
          as: "assign"
        }
      },
      { $unwind: "$assign" },
      {
        $project: {
          title: 1,
          description: 1,
          due: 1,
          assign: {
            $concat: ["$assign.name", " ", "$assign.lastname", " ", "$assign.id"]
          },
          _id: 1
        }
      }
    ];
    collection.aggregate(aggregation_array).toArray(function(err, docs) {
      docs.map(doc => {
        doc.description = decodeEntities(striptags(doc.description));
        doc.title = decodeEntities(striptags(doc.title));
      });
      assert.equal(err, null);

      return res.json({ tasks: docs });
    });
  });
});

// app.get("/", passport.authenticate("shraga"), function(req, res, next) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// app.post("/auth/callback", passport.authenticate("shraga"), function(
//   req,
//   res,
//   next
// ) {
//   //res.send(req.user);
//   res.redirect("/");
// });
//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));

//build mode
// app.get("/", passport.authenticate("shraga"), (req, res) => {
//   console.log("dddddd");
//   return res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

//Error handlers & middlewares
if (!isProduction) {
  app.use(function(err, req, res, next) {
    return res.status(err.status || 500).json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use(function(err, req, res, next) {
  return res.status(err.status || 500).res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));

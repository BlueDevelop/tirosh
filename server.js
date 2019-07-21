const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");
const fileUpload = require("express-fileupload");

const striptags = require("striptags");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
const decodeEntities = entities.decode;

// Connection URL
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "icu-dev";
const projectId = "5bb9e79df82c0151fc0cd5c8";

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "passport-tutorial",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
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

//Configure Mongoose
mongoose.connect("mongodb://localhost/tirosh");

//mongoose.set('debug', true);

//Models & routes
require("./models/Users");
require("./models/Updates");
require("./models/Events");
require("./config/passport");
app.use(require("./routes"));

app.get("/isalive", (req, res) => {
  return res.status(200).send("alive");
});

app.get("/api/tasks", (req, res) => {
  const client = new MongoClient(url);
  client.connect(function(err) {
    assert.equal(null, err);
    const db = client.db(dbName);
    const collection = db.collection("projects");
    const aggregation_array = [
      {
        $match: {
          project: {
            project: new ObjectID(projectId),
            recycled: { $exists: false }
          }
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
          assign: { $concat: ["$assign.name", "  ", "$assign.id"] },
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
//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));

//build mode
app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

const mongoose = require("mongoose");

const { Schema } = mongoose;

const UpdatesSchema = new Schema({
  text: String,
  created: Date
});

mongoose.model("Updates", UpdatesSchema);

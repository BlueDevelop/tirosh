const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventsSchema = new Schema({
  title: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  color: { type: String, default: "#378006" }
});

mongoose.model("Events", EventsSchema);

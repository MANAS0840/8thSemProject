const mongoose = require("mongoose");

const SubFolderSchema = new mongoose.Schema({
  title: { type: String },
  language: { type: String },
  code: { type: String },
});

module.exports = mongoose.model("SubFolder", SubFolderSchema);

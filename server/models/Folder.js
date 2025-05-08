const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  FolderName: {
    type: String,
  },
  subFolder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubFolder",
    },
  ],
});


module.exports = mongoose.model("Folder", FolderSchema);

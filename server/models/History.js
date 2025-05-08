const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  Folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    require: true,
  },
  discription: {
    type: String,
    require: true,
  },
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  profile: {
    type: String,
  },
});

module.exports = mongoose.model("Content", contentSchema);

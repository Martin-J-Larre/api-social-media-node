const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Post", PostSchema);

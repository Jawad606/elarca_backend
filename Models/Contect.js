var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContentUs = new Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContentUs", ContentUs);

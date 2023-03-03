var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Test = new Schema(
  {
    filename: {
        type: [String],
    },
    content: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", Test);

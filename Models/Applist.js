var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Applist = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    ratingplay: {
      type: String,
    },
    ratingapple: {
      type: String,
    },
    version: {
      type: String,
    },
    icon: {
      type: String,
    },
    company: {
      type: String,
    },
    playLink: {
      type: String,
    },
    appleLink: {
      type: String,
    },
    screenshot: { type: Array, default: [] },
    filter1: { type: Array, default: [] },
    para:{ type: Array, default: [] },
    ageRange: { type: Array, default: [] },
    devices: { type: Array, default: [] },
    price: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Applist", Applist);

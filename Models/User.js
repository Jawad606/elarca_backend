var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var User = new Schema(
  {
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    dateOfbirth: {
      type: String,
    },
    gender: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    relationship: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
User.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", User);

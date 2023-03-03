var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var authenticate = require("../auth");
const bodyParser = require("body-parser");
var User = require("../Models/User");
const path = require("path");
const cors = require("./cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
var multer = require("multer");
router.use(bodyParser.json());
var passport = require("passport");
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

/* GET users listing. */
router.options("*", cors.cors, (req, res) => {
  res.sendStatus(200);
});

// using cloudinary to save images into the database. it an other cloud based database
cloudinary.config({
  cloud_name: "dhzwwylg8",
  api_key: "476756812639755",
  api_secret: "2mhuNMJKjtbNxFXZttkFIky85ZI",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
  },
});

var upload = multer({ storage: storage });
// signup router which will send the data to database
router.post(
  "/signup",
  cors.cors,
  upload.single("profileImg"),
  (req, res, next) => {
    User.register(
      new User({ email: req.body.email }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          if (req.body.username) user.username = req.body.username;
          if (req.body.email) user.email = req.body.email;
          if (req.body.dateOfbirth) user.dateOfbirth = req.body.dateOfbirth;
          if (req.body.gender) user.gender = req.body.gender;
          if (req.body.country) user.country = req.body.country;
          if (req.body.relationship) user.relationship = req.body.relationship;
          if (req.file.filename) user.profileImg = req.file.path;
          user.save((err, user) => {
            if (err) {
              console.log("Authenticated Saved but not send essage ");
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({ err: err });
              return;
            }
            passport.authenticate("local")(req, res, () => {
              console.log("Authenticated successfully ");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          });
        }
      }
    );
  }
);

// login request
router.post("/login", cors.cors, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
      res.end();
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: false,
            status: "Login Unsuccessful!",
            err: err,
          });
          res.end();
        }
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Login Successful!",
          token: token,
          user: req.user,
        });
      });
    }
  })(req, res, next);
});
// Logout request.
router
  .route("/logout")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("session-id");
      res.redirect("/");
      res.status(200).json({
        status: "Bye!",
      });
    } else {
      var err = new Error("You are not logged in!");
      err.status = 403;
      next(err);
      console.log("erroe");
    }
  });

router.route("/").options(cors.cors, (req, res) => {
  res.sendStatus(200);
});

router.get("/checkJWTtoken", cors.cors, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

// Change password request
router
  .route("/changepassword/:userId")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.cors, function (req, res) {
    User.findOne({ _id: req.params.userId }, (err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: "User not found" }); // Return error, user was not found in db
        } else {
          user.changePassword(
            req.body.oldpassword,
            req.body.newpassword,
            function (err) {
              if (err) {
                if (err.name === "IncorrectPasswordError") {
                  res.json({ success: false, message: "Incorrect password" }); // Return error
                } else {
                  res.json({
                    success: false,
                    message:
                      "Something went wrong!! Please try again after sometimes.",
                  });
                }
              } else {
                res.json({
                  success: true,
                  message: "Your password has been changed successfully",
                });
              }
            }
          );
        }
      }
    });
  });
// reset password request.
router
  .route("/reset")
  .options(cors.cors, (req, rdes) => {
    res.sendStatus(200);
  })
  .put(cors.cors, (req, res, next) => {
    User.findOne({ email: req.body.email }).then((u) => {
      u.setPassword(req.body.password, (err, u) => {
        if (err) return next(err);
        u.save();
        res.status(200).json({ message: "password change successful" });
      });
    });
  });
// edit user credential
router.put("/:userId", cors.cors, (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((cata) => {
      User.findById(cata._id).then((cata) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cata);
      });
    })
    .catch((err) => console.log(err));
});

// Delete the user.
router.delete("/:userId", cors.cors, (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.userId);
  User.findByIdAndRemove(id)
    .then((cata) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(cata);
    })
    .catch((err) => console.log(err));
});

module.exports = router;

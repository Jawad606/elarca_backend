const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const Rating = require("../Models/Rating");
const ratingRouter = express.Router();

ratingRouter.use(bodyParser.json());

ratingRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
      Rating.find().populate('user').then((rate) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(rate);
      });
    
  })
  .post(cors.corsWithOptions,  (req, res, next) => {
    if(!req.body.user){
     req.body.user = req.user._id;
    }
    else{
      req.body.user = mongoose.Types.ObjectId(req.body.user);
    }
    Rating.create(req.body)
      .then((rate) => {
        Rating.findById(rate._id)
          .populate("user")
          .then((rate) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(rate);
          });
      })
      .catch((err) => console.log(err));
  })
  
  
ratingRouter
.route("/:rateId")
.options(cors.corsWithOptions,auth.verifyUser,   (req, res) => {
  res.sendStatus(200);
})
.put(cors.corsWithOptions, (req, res, next) => {
  Rating.findByIdAndUpdate(
      req.params.rateId,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((cata) => {
      Rating.findById(cata._id).populate("user")
        .then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
    })
    .catch((err) => console.log(err));
})
.delete(cors.corsWithOptions,auth.verifyUser, (req, res, next) => {
 const id = mongoose.Types.ObjectId(req.params.rateId);
  Rating.findByIdAndRemove(id)
  .then((cata) => {
    Rating.find().populate('user').then((rate) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(rate);
    });
  })
  .catch((err) => console.log(err));
});

module.exports = ratingRouter;

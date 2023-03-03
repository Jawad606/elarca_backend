const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const Applist = require("../Models/Applist");
const applistRouter = express.Router();

applistRouter.use(bodyParser.json());

applistRouter
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Applist.find().then((rate) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(rate);
    });
  })
  .post(cors.cors, (req, res, next) => {
    Applist.create(req.body)
      .then((rate) => {
        Applist.findById(rate._id).then((rate) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rate);
        });
      })
      .catch((err) => console.log(err));
  });

applistRouter
  .route("/:appId")
  .options(cors.cors, auth.verifyUser, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.cors, (req, res, next) => {
    Applist.findByIdAndUpdate(
      req.params.appId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((cata) => {
        Applist.findById(cata._id).then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
      })
      .catch((err) => console.log(err));
  })
  .delete(cors.cors, auth.verifyUser, (req, res, next) => {
    Applist.findByIdAndRemove(req.params.catId)
      .then((cata) => {
        Applist.findById(cata._id).then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
      })
      .catch((err) => console.log(err));
  });

module.exports = applistRouter;

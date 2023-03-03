const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const ContentUs = require("../Models/Contect");
const contectRouter = express.Router();

contectRouter.use(bodyParser.json());

contectRouter
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    ContentUs.find().then((rate) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(rate);
    });
  })
  .post(cors.cors, (req, res, next) => {
    ContentUs.create(req.body)
      .then((rate) => {
        ContentUs.findById(rate._id)
        .then((rate) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rate);
        });
      })
      .catch((err) => console.log(err));
  });

contectRouter
  .route("/:rateId")
  .options(cors.cors, auth.verifyUser, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.cors, (req, res, next) => {
    ContentUs.findByIdAndUpdate(
      req.params.rateId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((cata) => {
        ContentUs.findById(cata._id).then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
      })
      .catch((err) => console.log(err));
  })
  .delete(cors.cors, auth.verifyUser, (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.rateId);
    ContentUs.findByIdAndRemove(id)
      .then((cata) => {
        ContentUs.find().then((rate) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rate);
        });
      })
      .catch((err) => console.log(err));
  });

module.exports = contectRouter;

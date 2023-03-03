const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const Favourite = require("../Models/Favourite");
const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
      Favourite.find().populate('user').populate('applist').then((rate) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(rate);
      });
    
  })
  .post(cors.cors,  (req, res, next) => {
    if(!req.body.user){
     req.body.user = req.user._id;
     req.body.applist=mongoose.Types.ObjectId(req.body.applist);
    }
    else{
      req.body.user = mongoose.Types.ObjectId(req.body.user);
      req.body.applist=mongoose.Types.ObjectId(req.body.applist);
    }
    Favourite.create(req.body)
      .then((rate) => {
        Favourite.findById(rate._id)
          .populate("user")
          .populate('applist')
          .then((rate) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(rate);
          });
      })
      .catch((err) => console.log(err));
  })
  
  
favouriteRouter
.route("/:favId")
.options(cors.cors,auth.verifyUser,   (req, res) => {
  res.sendStatus(200);
})
.put(cors.cors, (req, res, next) => {
  Favourite.findByIdAndUpdate(
      req.params.favId,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((cata) => {
      Favourite.findById(cata._id).populate("user")
        .then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
    })
    .catch((err) => console.log(err));
})




.delete(cors.cors,auth.verifyUser, (req, res, next) => {
 const id = mongoose.Types.ObjectId(req.params.favId);
  Favourite.findByIdAndRemove(id)
  .then((cata) => {
    Favourite.find().populate('applist').populate('user').then((rate) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(rate);
    });
  })
  .catch((err) => console.log(err));
});

module.exports = favouriteRouter;

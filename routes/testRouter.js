const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var multer = require("multer");
var fs = require("fs");
var path = require("path");
const { request } = require("http");
var auth = require("../auth");

const Test = require("../Models/Test");
const testRouter = express.Router();

const pdf = require("pdf-parse");

const getAllDirFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(file);
    }
  });

  return arrayOfFiles;
};
var result=[]
var files = [];
  var dataBuffer = [];
async function readFiles() {
  console.log("readFiles");
 
  return 0;
}

testRouter.use(bodyParser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/PDF");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.originalname}`
    );
  },
});
var upload = multer({ storage: storage });
testRouter
  .route("/")
  .options(cors.cors, (req, res) => {
    res.sendStatus(200);
  })
  .get((req, res, next) => {
    Test.find().then((rate) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(rate);
    });
  })
  .post(upload.array("files"),async (req, res, next) => {
    // const test=  readFiles();
    var result = getAllDirFiles("public/PDF");
    for (let i = 0; i < result.length; i++) {
      dataBuffer[i] = fs.readFileSync("public/PDF/" + result[i]);
      await pdf(dataBuffer[i]).then(function (data) {
          console.log(result[i])
        files[i] = data.text;
        console.log(files[i]);
        console.log(result[i]);
      });
    }
    req.body.filename = result;
    req.body.content = files;
    Test.create(req.body)
      .then((rate) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(rate);
        for(let i =0 ; i< result.length;i++){
            fs.unlinkSync("public/PDF/"+result[i]);
        }
      })
      .catch((err) => console.log(err));
  });

testRouter
  .route("/:rateId")
  .options(cors.cors, auth.verifyUser, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.cors, (req, res, next) => {
    Test.findByIdAndUpdate(
      req.params.rateId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((cata) => {
        Test.findById(cata._id).then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
      })
      .catch((err) => console.log(err));
  })
  .delete(cors.cors, auth.verifyUser, (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.rateId);
    Test.findByIdAndRemove(id)
      .then((cata) => {
        Test.find().then((rate) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(rate);
        });
      })
      .catch((err) => console.log(err));
  });

module.exports = testRouter;

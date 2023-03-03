// this is main the file which authenticate request
// only request from these lnks are authenticated.
const express = require("express");
const cors = require("cors");
const app = express();
// these links are used to for fontend. Only these link request are authenticated
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://jawad606.github.io",
  "https://www.elarcaapps.org",
  "https://el-arca-apps-for-deployment.vercel.app"
];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log(req.header("Origin"));
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);

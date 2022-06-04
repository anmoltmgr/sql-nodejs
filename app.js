require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//db connection
db.connect((err) => {
  if (err) throw err;
  console.log("mysql connected...");
});

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
const dbRouter = require("./routes/db");
const req = require("express/lib/request");
req.db = db;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE videodb";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created!!!");
  });
});

app.get("/create-video-tables", (req, res) => {
  let videoTable = `CREATE TABLE Video(VideoID VARCHAR(255) NOT NULL, Name VARCHAR(255), Description VARCHAR(255), Active BOOLEAN, PRIMARY KEY (VideoID)  )`;

  let videoListTable = `CREATE TABLE VideoList(VideoListID VARCHAR(255) NOT NULL, Name VARCHAR(255), Link VARCHAR(255),VideoID VARCHAR(255) NOT NULL, PRIMARY KEY (VideoListID), FOREIGN KEY (VideoID) REFERENCES Video(VideoID) )`;

  db.query(videoTable, (err, result) => {
    if (err) throw err;
    console.log(result);

    db.query(videoListTable, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("createdd tables");
    });
  });
});
//add db connection to express pipeline

app.use("/", indexRouter);

app.use("/db", dbRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

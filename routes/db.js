var express = require("express");
const { uuid } = require("uuidv4");
const res = require("express/lib/response");
var router = express.Router();

// get video channel data
router.get("/all-video-channel", function (req, res, next) {
  const db = req.db;

  let getAllVideoChannel = `SELECT * FROM Video`;

  db.query(getAllVideoChannel, (err, result) => {
    if (err) res.send(err);
    console.log(result);
    res.send(result);
  });
});
//get video list data
router.get("/video-list-by-channelid", function (req, res, next) {
  const db = req.db;
  const params = req.query;
  const videoID = params.videoID;
  console.log("params", videoID);
  let getAllVideoChannel = `
  SELECT * FROM VideoList
  WHERE VideoID='${videoID}'
  `;

  db.query(getAllVideoChannel, (err, result) => {
    if (err) res.send(err);
    console.log(result);
    res.send(result);
  });
});

// post video data
router.post("/create-channel", function (req, res, next) {
  const db = req.db;
  const body = req.body;
  console.log("body:", body);
  const { name, description, active } = body;

  const videoID = uuid();

  let postVideoDataQuery = `
  INSERT INTO Video (VideoID, Name, Description, Active)
VALUES ('${videoID}', '${name}', '${description}', ${active})
  `;

  db.query(postVideoDataQuery, (err, result) => {
    if (err) res.send(err);
    console.log(result);
    res.send("successfully inserted");
  });
});

// post video list data
router.post("/add-video-list", function (req, res, next) {
  try {
    const db = req.db;
    const body = req.body;
    console.log("body:", body);
    const { name, link, videoID } = body;
    if (!videoID) throw { message: "videoID is requireed" };

    const videoListID = uuid();

    let postVideoListDataQuery = `
  INSERT INTO VideoList (VideoListID, Name, Link, videoID)
VALUES ('${videoListID}', '${name}', '${link}', '${videoID}')
  `;

    db.query(postVideoListDataQuery, (err, result) => {
      if (err) return res.send(err);
      console.log(result);
      res.send("successfully inserted");
    });
  } catch (ex) {
    res.send(ex);
  }
});

// update videolist
router.put("/videolist", function (req, res, next) {
  try {
    const db = req.db;

    const body = req.body;
    console.log("body:", body);
    const { videoListID, name, link } = body;

    if (!videoListID) throw { message: "videoListID is required!!" };
    let updateVideoListQuery = `

    UPDATE VideoList
    SET Name='${name}', Link='${link}'  
    WHERE VideoListID='${videoListID}'
  `;

    db.query(updateVideoListQuery, (err, result) => {
      if (err) return res.send(err);
      console.log("result:", result);
      res.send("successfully updated");
    });
  } catch (ex) {
    res.send(ex);
  }
});

//update video channel
router.put("/video", function (req, res, next) {
  try {
    const db = req.db;

    const body = req.body;
    console.log("body:", body);
    const { videoID, name, description, active } = body;
    console.log("videoID", videoID);

    if (!videoID) throw { message: "videoID is required!!" };
    let updateVideoQuery = `

    UPDATE video
    SET Name='${name}', Description='${description}', Active='${active}'
    WHERE VideoID='${videoID}'
  `;

    db.query(updateVideoQuery, (err, result) => {
      if (err) return res.send(err);
      console.log("result:", result);
      res.send("successfully updated");
    });
  } catch (ex) {
    res.send(ex);
  }
});

// delete video list
router.delete("/videolist", function (req, res, next) {
  try {
    const db = req.db;

    const params = req.query;
    console.log("params:", params);

    const videoListID = params.videoListID;

    console.log("videoListID:", videoListID);
    let deleteVideoListQuery = `
  DELETE FROM VideoList WHERE VideoListID='${videoListID}'
  `;

    db.query(deleteVideoListQuery, (err, result) => {
      if (err) return res.send(err);
      console.log("result:", result);
      res.send("successfully deleted");
    });
  } catch (ex) {
    res.send(ex);
  }
});

//Delete video channel data
router.delete("/video", function (req, res, next) {
  try {
    const db = req.db;

    const params = req.query;
    console.log("params:", params);

    const videoID = params.videoID;

    console.log("videoID:", videoID);
    let deleteVideoQuery = `
  DELETE FROM Video WHERE VideoID='${videoID}'
  `;

    db.query(deleteVideoQuery, (err, result) => {
      if (err) return res.send(err);
      console.log("result:", result);
      res.send("successfully deleted");
    });
  } catch (ex) {
    res.send(ex);
  }
});

module.exports = router;

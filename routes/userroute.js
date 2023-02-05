const express = require("express");
const router = express.Router();
const userRouter = require("../controllers/user");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./upload/videos",
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 52428800,
  },
});

router.post("/adduser", userRouter.userSignup);
router.post("/add", userRouter.userpost);
router.post("/signin", userRouter.userLogin);
router.post("/content", upload.single("profile"), userRouter.content);
router.get("/allcontentofuser", userRouter.getAllUserContent);
router.get("/alluser", userRouter.getAllUser);
router.get("/allcontent", userRouter.getAllContent);
router.put("/like/:_id", userRouter.like )
router.put("/unlike/:_id", userRouter.unlike)
router.post("/comment", userRouter.comment)
router.get("/comment", userRouter.getAllComment)


module.exports = router;

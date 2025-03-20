const express = require("express");
const mediaController = require("../controllers/mediaController");
const authenticate = require("../middleware/authenticate");
const upload = require("../utils/s3Upload");

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  mediaController.uploadMedia
);
router.get("/", authenticate, mediaController.getMedia);

module.exports = router;

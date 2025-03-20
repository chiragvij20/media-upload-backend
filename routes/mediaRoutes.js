const express = require("express");
const mediaController = require("../controllers/mediaController");
const authenticate = require("../middleware/authenticate");
const upload = require("../utils/s3Upload");

const router = express.Router();

// Upload media
router.post(
  "/upload",
  authenticate,
  upload.single("file"), // Use the S3 upload middleware
  mediaController.uploadMedia
);

// Get media
router.get("/", authenticate, mediaController.getMedia);

// Delete media
router.delete("/delete", authenticate, mediaController.deleteMedia);

module.exports = router;
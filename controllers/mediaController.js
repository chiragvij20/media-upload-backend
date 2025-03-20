const db = require("../db");

exports.uploadMedia = async (req, res) => {
  const fileUrl = req.file.location;
  const userId = req.user.id;

  try {
    // Use PostgreSQL placeholders ($1, $2)
    await db.query('INSERT INTO media ("userId", "fileUrl") VALUES ($1, $2)', [
      userId,
      fileUrl,
    ]);

    res.json({ fileUrl });
  } catch (err) {
    console.error("Error uploading media:", err);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

exports.getMedia = async (req, res) => {
  const userId = req.user.id;

  try {
    // Use PostgreSQL placeholders ($1)
    const { rows: media } = await db.query(
      'SELECT * FROM media WHERE "userId" = $1',
      [userId]
    );

    res.json(media);
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ message: "Failed to fetch media" });
  }
};

const AWS = require("aws-sdk");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.deleteMedia = async (req, res) => {
  const { mediaIds } = req.body;
  const userId = req.user.id;

  try {
    const { rows: mediaFiles } = await db.query(
      'SELECT "fileUrl" FROM media WHERE id = ANY($1) AND "userId" = $2',
      [mediaIds, userId]
    );
    console.log("hi");

    const deletePromises = mediaFiles.map((file) => {
      const key = file.fileUrl.split("/").pop();
      return s3
        .deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: key })
        .promise();
    });

    console.log("hi1");

    await Promise.all(deletePromises);

    console.log("hi2 ");

    await db.query('DELETE FROM media WHERE id = ANY($1) AND "userId" = $2', [
      mediaIds,
      userId,
    ]);

    res.json({ message: "Media files deleted successfully" });
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ message: "Failed to delete media files" });
  }
};
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

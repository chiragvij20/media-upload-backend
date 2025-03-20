const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google payload:", payload);

    const { sub, email, name, picture } = payload;

    // Remove the =s96-c suffix from the picture URL
    const cleanedPictureUrl = picture.replace(/=s96-c$/, "");

    // Check if user exists
    let { rows: user } = await db.query(
      'SELECT * FROM users WHERE "googleId" = $1',
      [sub]
    );

    if (user.length === 0) {
      // Create new user
      await db.query(
        'INSERT INTO users ("googleId", "email", "name", "picture") VALUES ($1, $2, $3, $4)',
        [sub, email, name, cleanedPictureUrl] // Include the picture field
      );

      // Fetch the newly created user
      const { rows: newUser } = await db.query(
        'SELECT * FROM users WHERE "googleId" = $1',
        [sub]
      );
      user = newUser;
    }

    // Generate JWT
    const jwtToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Include the picture in the response
    res.json({ token: jwtToken, user: { ...user[0], picture } });
    console.log(res.json);
  } catch (err) {
    console.error("Error in Google login:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
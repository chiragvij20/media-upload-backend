const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token); // Log the token

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Google payload:", payload); // Log the payload

    const { sub, email, name } = payload;

    // Check if user exists
    let { rows: user } = await db.query(
      'SELECT * FROM users WHERE "googleId" = $1',
      [sub]
    );

    if (user.length === 0) {
      // Create new user
      await db.query(
        'INSERT INTO users ("googleId", "email", "name") VALUES ($1, $2, $3)',
        [sub, email, name]
      );

      // Fetch the newly created user
      const { rows: newUser } = await db.query(
        'SELECT * FROM users WHERE "googleId" = $1',
        [sub]
      );

      // Generate JWT for the new user
      const jwtToken = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token: jwtToken, user: newUser[0] });
    } else {
      // Generate JWT for existing user
      const jwtToken = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token: jwtToken, user: user[0] });
    }
  } catch (err) {
    console.error("Error in Google login:", err); // Log the error
    res.status(500).json({ message: "Something went wrong" });
  }
};

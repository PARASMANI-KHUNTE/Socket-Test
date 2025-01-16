const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User');
const passport = require("passport");
router.use(session({ secret: "secret", resave: false, saveUninitialized: true }));


router.use(passport.initialize());
router.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/social/auth/google/callback"
,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value; // Get email from Google
          const googleId = profile.id;
          const name = profile.displayName;
          const ProfileUrl = profile.photos[0]?.value;

  
          // Check if the user already exists
          let user = await User.findOne({ email });
  
          if (!user) {
            // Create new user
            user = await User.create({
              name,
              email,
              googleId,
              ProfileUrl,
            });
          }
  
          return done(null, user);
        } catch (err) {
          console.error("Error in Google callback:", err);
          return done(err, null);
        }
      }
    )
  );
  
// Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET || "JWT_SECRET",
        { expiresIn: "1h" }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.status(200).json({token : token , message: 'Login successful' });
    
    } catch (err) {
      console.error("Error in Google callback:", err);
      res.redirect("/failure");
    }
  }
);

router.get('/failure', (req, res) => {
  res.json({
    message: "Failed to connect with Google"
  });
});



module.exports = router
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const User = require('../models/User');
const passport = require("passport");

router.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

router.use(passport.initialize());
router.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/social/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        const ProfileUrl = profile.photos[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            ProfileUrl,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// // LinkedIn Strategy
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: "/api/social/auth/linkedin/callback",
//       scope: ["r_liteprofile", "r_emailaddress"]
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const linkedinId = profile.id;
//         const name = profile.displayName;
//         const ProfileUrl = profile.photos[3]?.value;

//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             name,
//             email,
//             linkedinId,
//             ProfileUrl,
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         console.error("Error in LinkedIn callback:", err);
//         return done(err, null);
//       }
//     }
//   )
// );

// // Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: "/api/social/auth/facebook/callback",
//       profileFields: ["id", "emails", "name", "picture"]
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const facebookId = profile.id;
//         const name = profile.displayName;
//         const ProfileUrl = profile.photos[0]?.value;

//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             name,
//             email,
//             facebookId,
//             ProfileUrl,
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         console.error("Error in Facebook callback:", err);
//         return done(err, null);
//       }
//     }
//   )
// );

// Routes
// Google Auth
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
      res.status(200).redirect(`http://localhost:5173/home?token=${token}`);
    } catch (err) {
     
      res.redirect("/failure");
    }
  }
);

// // LinkedIn Auth
// router.get("/auth/linkedin", passport.authenticate("linkedin"));

// router.get(
//   "/auth/linkedin/callback",
//   passport.authenticate("linkedin", { failureRedirect: "/failure" }),
//   async (req, res) => {
//     try {
//       const user = req.user;
//       const token = jwt.sign(
//         {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//         process.env.JWT_SECRET || "JWT_SECRET",
//         { expiresIn: "1h" }
//       );
//       res.status(200).redirect(`http://localhost:5173/home?token=${token}`);
//     } catch (err) {
//       console.error("Error in LinkedIn callback:", err);
//       res.redirect("/failure");
//     }
//   }
// );

// // Facebook Auth
// router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/failure" }),
//   async (req, res) => {
//     try {
//       const user = req.user;
//       const token = jwt.sign(
//         {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//         process.env.JWT_SECRET || "JWT_SECRET",
//         { expiresIn: "1h" }
//       );
//       res.status(200).redirect(`http://localhost:5173/home?token=${token}`);
//     } catch (err) {
//       console.error("Error in Facebook callback:", err);
//       res.redirect("/failure");
//     }
//   }
// );

router.get("/failure", (req, res) => {
  res.json({
    message: "Failed to authenticate with the social platform"
  });
});

module.exports = router;

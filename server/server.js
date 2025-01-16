const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/", // Replace with your client URL for production
    methods: ["GET", "POST"],
  },
});
const jwt = require("jsonwebtoken");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
const db = require('./config/dbConfig');
db();

// Session setup
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);


// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
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
            mobile: null, // Omit mobile field if not provided
            ProfileUrl,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in Google callback:', err);
        return done(err, null);
      }
    }
  )
);
// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
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

      res.redirect(
        `http://localhost:5173/home?token=${token}`
      );
    } catch (err) {
      console.error("Error in Google callback:", err);
      res.redirect("/failure");
    }
  }
);

app.get('/failure', (req, res) => {
  res.json({
    message: "Failed to connect with Google"
  });
});

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

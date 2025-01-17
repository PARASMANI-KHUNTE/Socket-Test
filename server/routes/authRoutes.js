const express = require('express')
const router = express.Router()
const {hassPassword,VerifyPassword} = require('../utils/hashUtils')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const secretkey = process.env.secretKey
const {generateTokenForPassword,verifyToken} = require('../utils/tokenProvider')
const { sendOTP, verifyOTP }  = require('../utils/otpProvider')


router.post('/signup', async (req, res) => {
    const { name, email, mobile, password } = req.body; // Correctly destructure fields from req.body


    // Check if all required fields are provided
    if (!name || !email || !mobile || !password) {
        return res.status(400).json({
            message: "Please provide name, email, mobile, and password."
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email."
            });
        }

        // Hash the password
        const hashedPassword = await hassPassword(password);

        // Create a new user
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success
        res.status(200).json({
            message: "Successful signup"
        });
    } catch (error) {
        // Handle any errors that might occur during the process
        // console.error(error);
        res.status(500).json({
            message: "An error occurred while processing your request."
        });
    }
});


router.post('/login',async(req,res)=>{
    const {email , password} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            message : "Enter Email and Password"
        })
    }

    const IsUser = await User.findOne({email})
    if(!IsUser){
        return res.status(404).json({
            message : "Invalid Email And Password"
        })
    }
    const checkPassword = await VerifyPassword(IsUser.password,password)
    if(!checkPassword){
        return res.status(401).json({
            message : "Wrong Password"
        })
    }

    const payload = {
        name : IsUser.name,
        email 
    }
    
    const generateToken =  jwt.sign({payload},secretkey,{expiresIn: '1h'})

    return res.status(200).json({
        message : "login Successful",
        token : generateToken
    })

})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return res.status(400).json({
            message: "Please Provide Email"
        });
    }

    try {
        // Check if user exists in the database
        const isUser = await User.findOne({ email }); // Await the database call
        if (!isUser) {
            return res.status(404).json({
                message: "User Does not exist"
            });
        }

        // Send OTP to the user's email
        await sendOTP(email);
        // console.log("User ID:", isUser.id);

        // Generate token using the user's ID
        const token = generateTokenForPassword(isUser.id); // Generate the token synchronously

        if (!token) {
            // console.log("Unable to generate token");
            return res.status(500).json({
                message: "Internal Server Error: Unable to generate token"
            });
        }

        // Respond with success message and token
        return res.status(200).json({
            message: `OTP sent successfully to ${email}`,
            token: token
        });
    } catch (error) {
        // console.error("Error in forgot-password route:", error.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        // Validate input
        if (!userId || !otp) {
            return res.status(400).json({
                message: "Both userId and OTP are required.",
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const email = user.email;

        // Verify the OTP
        const isOtpValid = await verifyOTP(email, otp);
        if (!isOtpValid) {
            return res.status(401).json({
                message: "Invalid OTP.",
            });
        }

        // OTP is valid
        return res.status(200).json({
            message: "OTP successfully verified.",
        });
    } catch (error) {
        // console.error("Error verifying OTP:", error.message);
        return res.status(500).json({
            message: "An error occurred while verifying the OTP.",
            error: error.message,
        });
    }
});

router.put('/update-password', async (req, res) => {
    const { userId, password } = req.body;

    // Validate the input
    if (!userId || !password) {
        return res.status(400).json({
            message: "userId and password are required",
        });
    }

    try {
        const hashedPassword = await hassPassword(password);
      
        // Find the user by ID and update the password
        const user = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        // console.error("Error updating password:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

router.post('/verify-token', async (req, res) => {
    const { token } = req.body; // Extract the token from the body

    if (!token || typeof token !== 'string') {
        return res.status(400).json({
            message: "Token is required and must be a string",
        });
    }

    try {
        const verify = verifyToken(token); // Call your token verification utility

        if (!verify) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            message: "Authorized",
        });
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
});


// Routes for Social Login
// router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
//     (req, res) => {
//         res.json({ message: "Logged in with Google", user: req.user });
//     });

// router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
// router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }),
//     (req, res) => {
//         res.json({ message: "Logged in with Facebook", user: req.user });
//     });

// router.get("/auth/linkedin", passport.authenticate("linkedin", { scope: ["r_emailaddress", "r_liteprofile"] }));
// router.get("/auth/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/" }),
//     (req, res) => {
//         res.json({ message: "Logged in with LinkedIn", user: req.user });
//     });
module.exports = router;
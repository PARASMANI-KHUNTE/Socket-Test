// middlewares/validationMiddleware.js

const { body, validationResult } = require('express-validator');

// Middleware to validate request data
const validationMiddleware = (validations) => {
    return async (req, res, next) => {
        // Run the validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check if any validation errors exist
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    };
};

// Example validation for user login
const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

module.exports = { validationMiddleware, loginValidation };

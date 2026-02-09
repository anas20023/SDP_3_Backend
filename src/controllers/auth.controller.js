import AuthService from '../services/auth.service.js';
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS
} from '../config/auth.config.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const handleRegister = async (req, res) => {
    const {
        name,
        user_id,
        email,
        password,
        dept,
        intake,
        section
    } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    // Input Check from Client Side

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }
    // console.log(emailRegex.test(email))
    if(!(passwordRegex.test(password))){
        return res.status(400).json({
            message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        })
    }
    if(!(emailRegex.test(email))){
        return res.status(400).json({
            message:"Invalid Email address"
        })
    }

    try {
        /*await AuthService.register({
            name,
            user_id,
            email,
            password,
            dept,
            intake,
            section
        });

        return res.status(201).json({
            message: 'User registered successfully'
        });
        */
    //    console.log("Oh NO!!")
    return res.status(201).json({
        message:"Oh Noooo!!!"
    })

    } catch (error) {
        console.error('Register Error:', error);

        // Example of controlled error mapping
        if (error.code === 'USER_EXISTS') {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        return res.status(400).json({
            message: 'Registration failed'
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    try {
        const { token } = await AuthService.login(email, password);

        res.cookie(
            AUTH_COOKIE_NAME,
            token,
            AUTH_COOKIE_OPTIONS
        );

        return res.status(200).json({
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const handleLogout = (req, res) => {
    res.clearCookie(
        AUTH_COOKIE_NAME,
        AUTH_COOKIE_OPTIONS
    );

    return res.status(200).json({
        message: 'Logout successful'
    });
};

/**
 * Get authenticated user profile
 * GET /api/auth/profile
 */
export const handleProfile = async (req, res) => {
    // Auth middleware MUST attach req.user
    if (!req.user?.id) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    const userId = req.user.id;

    try {
        const profile = await AuthService.findData(userId);

        return res.status(200).json(profile);

    } catch (error) {
        console.error('Profile Error:', error);

        return res.status(500).json({
            message: 'Failed to fetch profile'
        });
    }
};

import AuthService from '../services/auth.service.js';
import { checkStudentID } from '../services/checkStudentID.service.js';
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS
} from '../config/auth.config.js';
import { uploadFile, deleteFile } from '../services/r2.service.js';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
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

    /* 1. Required Fields Check */
    if (!name || !email || !password || !user_id || !dept || !intake || !section) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    /* 2. Email Validation */
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            message: 'Invalid email address'
        });
    }

    /* 3. Password Validation */
    if (!passwordRegex.test(password)) {
        return res.status(422).json({
            message:
                'Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character'
        });
    }

    try {
        /* 4. Student ID Verification */
        const serverData = await checkStudentID(user_id, intake);

        if (!serverData) {
            return res.status(404).json({
                message: 'Student record not found'
            });
        }
        // const normalizedClientName = name.trim().toLowerCase();
        // const normalizedServerName = serverData.sis_std_name.trim().toLowerCase();

        // if (normalizedClientName !== normalizedServerName) {
        //     return res.status(403).json({
        //         message: 'Student name does not match official records'
        //     });
        // }

        /* 5. Register User */
        await AuthService.register({
            name: serverData.sis_std_name,
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

    } catch (error) {
        console.error('Register Error:', error);

        if (error.code === 'USER_EXISTS') {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        return res.status(500).json({
            message: error.message || 'Registration failed'
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
    /* Email Validation */
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            message: 'Invalid email address'
        });
    }

    /* Password Validation */
    if (!passwordRegex.test(password)) {
        return res.status(422).json({
            message:
                'Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character'
        });
    }

    try {
        const { user, token } = await AuthService.login(email, password);

        res.cookie(
            AUTH_COOKIE_NAME,
            token,
            AUTH_COOKIE_OPTIONS
        );

        return res.status(200).json({
            message: 'Login successful',
            name: user.name,
            email: user.email,
            dept: user.dept,
            intake: user.intake,
            role: user.role,
            img_url: user.img_url,
            createdAt: user.createdAt,
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
        if (profile.role !== req.user.role) {
            res.clearCookie(
                AUTH_COOKIE_NAME,
                AUTH_COOKIE_OPTIONS
            );
            throw new Error("Unauthorized to Access")
        }
        // console.log(req.user.role)
        // console.log(profile.role)
        return res.status(200).json(profile);

    } catch (error) {
        //console.error('Profile Error:', error);

        return res.status(500).json({
            message: 'Failed to fetch profile'
        });
    }
};

/**
 * Update authenticated user profile
 * PUT /api/auth/update-profile
 */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found' });
        }

        const updateData = { ...req.body };
        let oldImgUrl = null;

        // Handle image upload if a file is provided
        if (req.file) {
            try {
                // Fetch current user to check for an existing image
                const currentUser = await AuthService.findData(userId);
                oldImgUrl = currentUser.img_url;

                const imgUrl = await uploadFile(req.file);
                updateData.img_url = imgUrl;
            } catch (uploadError) {
                console.error('Image Upload Error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload image to storage' });
            }
        }

        const updatedUser = await AuthService.updateProfile(userId, updateData);

        // If update was successful and there was an old image, delete it from storage
        if (oldImgUrl) {
            try {
                await deleteFile(oldImgUrl);
            } catch (deleteError) {
                // We log the error but don't fail the request since the DB was updated successfully
                console.error('Failed to delete old image from R2:', deleteError);
            }
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                user_id: updatedUser.user_id,
                dept: updatedUser.dept,
                intake: updatedUser.intake,
                section: updatedUser.section,
                img_url: updatedUser.img_url,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({
            message: error.message || 'Failed to update profile'
        });
    }
};
export const handleChangePassword = async (req, res) => {
   // console.log(req.body)
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: 'Old password, new password, and confirm password are required'
        });
    }

    if (!passwordRegex.test(newPassword)) {
        return res.status(422).json({
            message:
                'Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(422).json({
            message: 'New password and confirm password do not match'
        });
    }

    try {
        const userId = req.user.id;
        const result = await AuthService.ChangePassword(userId, oldPassword, newPassword, confirmPassword);
        return res.status(200).json({
            message: result?.message || 'Password changed successfully'
        });
    } catch (err) {
        console.error('Change Password Error:', err);

        return res.status(500).json({
            message: err.message || 'Failed to change password'
        });
    }
}

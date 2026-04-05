import User from '../model/users.js';
import Suggestion from '../model/suggestions.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (userData) => {
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { user_id: userData.user_id }]
    });

    if (existingUser) {
        throw new Error('User already exists with this email or user_id');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const user = new User({
        ...userData,
        passwordHash: hashedPassword,
    });

    await user.save();
    return user;
};

const login = async (email, password) => {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate Token
    const token = jwt.sign(
        { user_id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret_key', // Fallback for dev - Ensure .env is set
        {
            expiresIn: '24h',
        }
    );

    return { user, token };
};
const findData = async (user) => {  
    const res = await User.findById(user)
    if (!res){
        throw new Error("User not Found")
    }
    // console.log(res._id.toString())
    const user_id=res._id.toString()
    const uploadsByUser = await Suggestion.find({
       uploaded_by:user_id
    })
    //console.log(uploadsByUser)
    const filtered_data={
        name:res.name,
        email:res.email,
        role:res.role,
        dept:res.dept,
        intake:res.intake,
        section:res.section,
        img_url:res.img_url,
        uploads:uploadsByUser,
        createdAt:res.createdAt
    }
    return filtered_data
}

const updateProfile = async (userId, updatedUserData) => {
    const allowedFields = ['name', 'email', 'dept', 'intake', 'section', 'user_id', 'img_url'];
    const updates = {};

    for (const field of allowedFields) {
        if (updatedUserData[field] !== undefined) {
            updates[field] = updatedUserData[field];
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUser) {
        throw new Error('User not Found');
    }

    return updatedUser;
}

const ChangePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    if (!userId) {
        throw new Error('Unauthorized');
    }
   console.log({oldPassword,newPassword,confirmPassword})
    if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match');
    }

    if (oldPassword === newPassword) {
        throw new Error('New password must be different from old password');
    }

    // Basic password policy
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not Found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
        throw new Error('Old password is incorrect');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password changed successfully' };
}
export default {
    register,
    login,
    findData,
    updateProfile,
    ChangePassword
}


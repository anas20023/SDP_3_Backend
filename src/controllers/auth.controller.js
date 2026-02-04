import AuthService from '../services/auth.service.js'

export const handleRegister = async (req, res) => {
    try {
        const { name, user_id, email, password, dept, intake, section } = req.body;

        // Basic validation could go here or in a separate validator middleware

        const user = await AuthService.register({
            name, user_id, email, password, dept, intake, section
        });

        res.status(200).json({
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(400).json({ message: error.message });
    }
}

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const { token } = await AuthService.login(email, password);

        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/',
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export const handleLogout = (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
    });

    res.status(200).json({ message: 'Logout successful' });
};

export const handleProfile = async (req, res) => {
    // console.log(req.user)
    const user = req.user.id
    try {
        const data = await AuthService.findData(user);
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json({
            "message": e.message
        })
    }
    // console.log(user)
}
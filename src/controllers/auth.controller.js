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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { user, token } = await AuthService.login(email, password);

        res.setHeader('Set-Cookie', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
        res.status(200).json({
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(401).json({ message: error.message });
    }
}

export const handleLogout = (req, res) => {
    try {
        //console.log(req.user);   
        res.setHeader('Set-Cookie', '', {
            httpOnly: true,
            maxAge: 0
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: error.message });
    }
}
export const handleProfile = async (req, res) => {
    // console.log(req.user)
    const user = req.user.user_id
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
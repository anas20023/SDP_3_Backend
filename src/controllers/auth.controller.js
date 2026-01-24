import AuthService from '../services/auth.service.js'

export const handleRegister = async (req, res) => {
    try {
        const { name, user_id, email, password, dept, intake, section } = req.body;

        // Basic validation could go here or in a separate validator middleware

        const user = await AuthService.register({
            name, user_id, email, password, dept, intake, section
        });

        res.status(200).json({
            message: "User registered successfully"});
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

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(401).json({ message: error.message });
    }
}
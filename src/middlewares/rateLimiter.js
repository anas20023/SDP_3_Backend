import ratelimit from 'express-rate-limit'
export const aiRateLimiter = ratelimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // max 10 requests per IP per window
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,

    message: {
        success: false,
        error: 'Too many requests. Please try again later.'
    },

    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Slow down.'
        })
    }
})
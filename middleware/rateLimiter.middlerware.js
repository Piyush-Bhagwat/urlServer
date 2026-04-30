import rateLimit from "express-rate-limit";

export const createRateLimiter = (max, windowMinutes, message) => rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, message },
    standardHeaders: true,  // sends RateLimit headers in response
    legacyHeaders: false,
});

export const defaultRateLimiter = createRateLimiter(80, 10, "Too many requests")
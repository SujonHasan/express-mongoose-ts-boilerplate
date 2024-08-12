
import rateLimit from "express-rate-limit";

const expressRateLimite = rateLimit({
    windowMs: process.env.WINDOW_BLOCK_SECOND * 1000, // 1 minute
    max: process.env.PER_WINDOW_MAX_REQUEST * 2, // limit each IP to 4 requests per windowMs
    message: `You have exceeded the ${process.env.PER_WINDOW_MAX_REQUEST * 2} requests in ${process.env.WINDOW_BLOCK_SECOND} seconds limit...`
})

export default expressRateLimite;
import slowDown from "express-slow-down";

const expressSlowDown = slowDown({
    windowMs: process.env.WINDOW_BLOCK_SECOND * 1000,
    delayAfter:  process.env.PER_WINDOW_MAX_REQUEST, // allow 2 requests per 1 minute, then...
    delayMs: () => process.env.RESPONSE_DELAY_SECOND * 1000 // delay each request by 1000ms after 2 requests
})

export default expressSlowDown;


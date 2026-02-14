const rateLimit = require('express-rate-limit');
console.log(typeof rateLimit);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
console.log(typeof limiter);

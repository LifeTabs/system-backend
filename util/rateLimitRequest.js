import rateLimit from "express-rate-limit";
import { send_error } from "#response";
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 60, // Limit each IP to 100 requests per `window`
	message: send_error("Quá nhiều request, vui lòng thử lại sau!"), // Send response error if too many requests
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
export default limiter;
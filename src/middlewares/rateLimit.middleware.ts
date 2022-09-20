import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../errors";

class RateLimitMiddlewares {
  public profileViewLimiter = rateLimit({
    keyGenerator: (req: Request, res: Response) =>
      `${req.socket.remoteAddress}-${req.body.businessId}`,
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 10, // Limit each IP with business to 10 requests per `window` (here, per 60 minutes)
    message:
      "Too many request created from this IP to this business, please try again later!",
    handler: (req: Request, res: Response, next: NextFunction, options) =>
      next(new TooManyRequestsError(options.message)),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
}

export default new RateLimitMiddlewares();

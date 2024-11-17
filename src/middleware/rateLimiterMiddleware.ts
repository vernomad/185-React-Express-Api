import LambdaRateLimiter from 'lambda-rate-limiter';
import { Request, Response, NextFunction } from 'express';


const limiter = LambdaRateLimiter({
    interval: 60000,
    uniqueTokenPerInterval: 3,
  });
  
  const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    limiter.check(3, req.ip ?? 'unknown')
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(429).send('To Many Requests')
    })
  }
  export default rateLimiter
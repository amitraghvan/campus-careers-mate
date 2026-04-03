import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

export function csrfTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.csrfToken) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', token, {
      httpOnly: false, // Must be accessible by JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  next();
}

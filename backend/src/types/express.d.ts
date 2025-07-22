import { JwtPayload } from '../../auth/dto/jwt-payload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};

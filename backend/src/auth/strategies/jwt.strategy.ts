import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/user-jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // ✅ Pastikan JWT_SECRET tersedia
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

async validate(payload: JwtPayload) {
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}
}

import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exist = await this.usersService.findByEmail(dto.email);
    if (exist) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role ?? 'user',
    });

    return {
      message: 'User registered',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

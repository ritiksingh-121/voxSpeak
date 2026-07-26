import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { XpService } from '../gamification/xp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: AppConfigService,
    private xpService: XpService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hashedPassword,
        profile: { create: {} },
        settings: { create: {} },
      },
      include: { profile: true, settings: true },
    });

    await this.xpService.addTransaction(user.id, 50, 'registration');

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true, settings: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async handleGoogleOAuth(token: string) {
    try {
      const { data } = await require('axios').get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return this.findOrCreateOAuthUser(data.email, data.name, data.sub, 'google');
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async handleGithubOAuth(code: string) {
    try {
      const tokenResp = await require('axios').post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.config.githubClientId,
          client_secret: this.config.githubClientSecret,
          code,
        },
        { headers: { Accept: 'application/json' } },
      );

      const accessToken = tokenResp.data.access_token;
      const { data } = await require('axios').get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const emailResp = await require('axios').get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailResp.data.find((e: any) => e.primary)?.email || `${data.id}@github.com`;

      return this.findOrCreateOAuthUser(primaryEmail, data.name || data.login, String(data.id), 'github');
    } catch {
      throw new UnauthorizedException('Invalid GitHub code');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwtSecret,
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      const tokens = await this.generateTokens(user.id, user.email);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  private async findOrCreateOAuthUser(email: string, name: string, oauthId: string, provider: string) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { accounts: { some: { providerAccountId: oauthId, provider } } }],
      },
      include: { profile: true, settings: true, accounts: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || 'User',
          profile: { create: {} },
          settings: { create: {} },
          accounts: {
            create: { provider, providerAccountId: oauthId },
          },
        },
        include: { profile: true, settings: true },
      });
    } else {
      const existingAccount = user.accounts?.find(
        (a) => a.provider === provider && a.providerAccountId === oauthId,
      );
      if (!existingAccount) {
        await this.prisma.account.create({
          data: { userId: user.id, provider, providerAccountId: oauthId },
        });
      }
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.jwtRefreshExpiresIn,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, accounts, ...rest } = user;
    return rest;
  }
}

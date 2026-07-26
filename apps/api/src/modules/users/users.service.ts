import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        settings: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: dto.name },
      });
    }

    const profileData: Record<string, any> = {};
    if (dto.bio !== undefined) profileData.bio = dto.bio;
    if (dto.avatarUrl !== undefined) profileData.avatarUrl = dto.avatarUrl;
    if (dto.nativeLanguage !== undefined) profileData.nativeLanguage = dto.nativeLanguage;
    if (dto.targetLanguage !== undefined) profileData.targetLanguage = dto.targetLanguage;
    if (dto.proficiencyLevel !== undefined) profileData.proficiencyLevel = dto.proficiencyLevel;
    if (dto.interests !== undefined) profileData.interests = dto.interests;

    if (Object.keys(profileData).length > 0) {
      await this.prisma.profile.update({
        where: { userId },
        data: profileData,
      });
    }

    return this.findById(userId);
  }

  async updateSettings(userId: string, settings: Record<string, any>) {
    const existing = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    if (!existing) {
      await this.prisma.userSettings.create({
        data: { userId, ...settings },
      });
    } else {
      await this.prisma.userSettings.update({
        where: { userId },
        data: settings,
      });
    }
    return this.findById(userId);
  }

  async getStats(userId: string) {
    const [
      conversationCount,
      totalMessages,
      vocabularyCount,
      currentStreak,
      totalXp,
      mistakes,
      weakAreas,
    ] = await Promise.all([
      this.prisma.conversation.count({ where: { userId } }),
      this.prisma.message.count({
        where: { conversation: { userId } },
      }),
      this.prisma.vocabularyItem.count({ where: { userId } }),
      this.prisma.streak.findFirst({
        where: { userId },
        orderBy: { lastActivity: 'desc' },
      }),
      this.prisma.xpTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.mistake.findMany({
        where: { userId },
        orderBy: { count: 'desc' },
        take: 10,
      }),
      this.prisma.weakArea.findMany({
        where: { userId },
        orderBy: { score: 'asc' },
        take: 5,
      }),
    ]);

    return {
      conversationCount,
      totalMessages,
      vocabularyCount,
      currentStreak: currentStreak?.currentCount || 0,
      totalXp: totalXp._sum.amount || 0,
      mistakes,
      weakAreas,
    };
  }
}

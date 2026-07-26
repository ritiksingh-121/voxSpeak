"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
let UsersService = class UsersService {
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                profile: true,
                settings: true
            }
        });
        if (!user) throw new _common.NotFoundException('User not found');
        const { passwordHash, ...rest } = user;
        return rest;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new _common.NotFoundException('User not found');
        if (dto.name) {
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name: dto.name
                }
            });
        }
        const profileData = {};
        if (dto.bio !== undefined) profileData.bio = dto.bio;
        if (dto.avatarUrl !== undefined) profileData.avatarUrl = dto.avatarUrl;
        if (dto.nativeLanguage !== undefined) profileData.nativeLanguage = dto.nativeLanguage;
        if (dto.targetLanguage !== undefined) profileData.targetLanguage = dto.targetLanguage;
        if (dto.proficiencyLevel !== undefined) profileData.proficiencyLevel = dto.proficiencyLevel;
        if (dto.interests !== undefined) profileData.interests = dto.interests;
        if (Object.keys(profileData).length > 0) {
            await this.prisma.profile.update({
                where: {
                    userId
                },
                data: profileData
            });
        }
        return this.findById(userId);
    }
    async updateSettings(userId, settings) {
        const existing = await this.prisma.userSettings.findUnique({
            where: {
                userId
            }
        });
        if (!existing) {
            await this.prisma.userSettings.create({
                data: {
                    userId,
                    ...settings
                }
            });
        } else {
            await this.prisma.userSettings.update({
                where: {
                    userId
                },
                data: settings
            });
        }
        return this.findById(userId);
    }
    async getStats(userId) {
        const [conversationCount, totalMessages, vocabularyCount, currentStreak, totalXp, mistakes, weakAreas] = await Promise.all([
            this.prisma.conversation.count({
                where: {
                    userId
                }
            }),
            this.prisma.message.count({
                where: {
                    conversation: {
                        userId
                    }
                }
            }),
            this.prisma.vocabularyItem.count({
                where: {
                    userId
                }
            }),
            this.prisma.streak.findFirst({
                where: {
                    userId
                },
                orderBy: {
                    lastActivity: 'desc'
                }
            }),
            this.prisma.xpTransaction.aggregate({
                where: {
                    userId
                },
                _sum: {
                    amount: true
                }
            }),
            this.prisma.mistake.findMany({
                where: {
                    userId
                },
                orderBy: {
                    count: 'desc'
                },
                take: 10
            }),
            this.prisma.weakArea.findMany({
                where: {
                    userId
                },
                orderBy: {
                    score: 'asc'
                },
                take: 5
            })
        ]);
        return {
            conversationCount,
            totalMessages,
            vocabularyCount,
            currentStreak: currentStreak?.currentCount || 0,
            totalXp: totalXp._sum.amount || 0,
            mistakes,
            weakAreas
        };
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(UsersService.name);
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map
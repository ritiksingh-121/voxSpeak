"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StreakService", {
    enumerable: true,
    get: function() {
        return StreakService;
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
let StreakService = class StreakService {
    async updateStreak(userId) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let streak = await this.prisma.streak.findUnique({
            where: {
                userId
            }
        });
        if (!streak) {
            streak = await this.prisma.streak.create({
                data: {
                    userId,
                    currentCount: 1,
                    longestCount: 1,
                    lastActivity: today,
                    frozenDays: 0
                }
            });
            await this.updateProfileStreak(userId, 1, 1);
            return streak;
        }
        const lastActivity = streak.lastActivity ? new Date(streak.lastActivity) : null;
        const lastDate = lastActivity ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate()) : null;
        if (lastDate && lastDate.getTime() === today.getTime()) {
            return streak;
        }
        const diffDays = lastDate ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 1;
        if (diffDays === 1) {
            const newCount = streak.currentCount + 1;
            const longest = Math.max(newCount, streak.longestCount);
            streak = await this.prisma.streak.update({
                where: {
                    userId
                },
                data: {
                    currentCount: newCount,
                    longestCount: longest,
                    lastActivity: today
                }
            });
            await this.updateProfileStreak(userId, newCount, longest);
        } else if (diffDays === 2 && streak.frozenDays > 0) {
            await this.prisma.streak.update({
                where: {
                    userId
                },
                data: {
                    frozenDays: {
                        decrement: 1
                    },
                    lastActivity: today
                }
            });
        } else if (diffDays > 1) {
            streak = await this.prisma.streak.update({
                where: {
                    userId
                },
                data: {
                    currentCount: 1,
                    lastActivity: today
                }
            });
            await this.updateProfileStreak(userId, 1, streak.longestCount);
        }
        return streak;
    }
    async getStreak(userId) {
        const streak = await this.prisma.streak.findUnique({
            where: {
                userId
            }
        });
        const hasActivityToday = await this.hasCompletedToday(userId);
        return {
            currentCount: streak?.currentCount ?? 0,
            longestCount: streak?.longestCount ?? 0,
            frozenDays: streak?.frozenDays ?? 0,
            lastActivity: streak?.lastActivity ?? null,
            hasActivityToday
        };
    }
    async freezeStreak(userId) {
        const streak = await this.prisma.streak.findUnique({
            where: {
                userId
            }
        });
        if (!streak) throw new Error('No streak to freeze');
        return this.prisma.streak.update({
            where: {
                userId
            },
            data: {
                frozenDays: {
                    increment: 1
                }
            }
        });
    }
    async hasCompletedToday(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await this.prisma.conversation.count({
            where: {
                userId,
                createdAt: {
                    gte: today
                }
            }
        });
        return count > 0;
    }
    async updateProfileStreak(userId, currentCount, longestCount) {
        await this.prisma.profile.update({
            where: {
                userId
            },
            data: {
                streakDays: currentCount,
                longestStreak: longestCount
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(StreakService.name);
    }
};
StreakService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], StreakService);

//# sourceMappingURL=streak.service.js.map
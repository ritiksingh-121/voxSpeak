"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GamificationService", {
    enumerable: true,
    get: function() {
        return GamificationService;
    }
});
const _common = require("@nestjs/common");
const _xpservice = require("./xp.service");
const _achievementservice = require("./achievement.service");
const _streakservice = require("./streak.service");
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
let GamificationService = class GamificationService {
    async awardXp(userId, amount, reason) {
        const transaction = await this.xpService.addTransaction(userId, amount, reason);
        const levelInfo = await this.xpService.getLevel(userId);
        const newlyUnlocked = await this.achievementService.check(userId);
        const streak = await this.streakService.updateStreak(userId);
        return {
            transaction,
            levelInfo,
            newlyUnlocked,
            streak
        };
    }
    async checkAchievements(userId) {
        return this.achievementService.check(userId);
    }
    async getDailyMissions() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const missions = await this.prisma.dailyMission.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        if (missions.length === 0) {
            const defaultMissions = [
                {
                    date: today,
                    title: 'Daily Practice',
                    description: 'Complete one conversation',
                    xpReward: 50,
                    type: 'daily'
                },
                {
                    date: today,
                    title: 'Vocabulary Builder',
                    description: 'Save 3 new words',
                    xpReward: 30,
                    type: 'daily'
                },
                {
                    date: today,
                    title: 'Pronunciation Focus',
                    description: 'Complete a pronunciation exercise',
                    xpReward: 40,
                    type: 'daily'
                }
            ];
            for (const m of defaultMissions){
                await this.prisma.dailyMission.create({
                    data: m
                });
            }
            return defaultMissions;
        }
        return missions;
    }
    async completeMission(userId, missionId) {
        const mission = await this.prisma.dailyMission.findUnique({
            where: {
                id: missionId
            }
        });
        if (!mission) throw new Error('Mission not found');
        await this.xpService.addTransaction(userId, mission.xpReward, `Mission: ${mission.title}`);
        return {
            mission,
            xpAwarded: mission.xpReward
        };
    }
    constructor(xpService, achievementService, streakService, prisma){
        this.xpService = xpService;
        this.achievementService = achievementService;
        this.streakService = streakService;
        this.prisma = prisma;
        this.logger = new _common.Logger(GamificationService.name);
    }
};
GamificationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _xpservice.XpService === "undefined" ? Object : _xpservice.XpService,
        typeof _achievementservice.AchievementService === "undefined" ? Object : _achievementservice.AchievementService,
        typeof _streakservice.StreakService === "undefined" ? Object : _streakservice.StreakService,
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], GamificationService);

//# sourceMappingURL=gamification.service.js.map
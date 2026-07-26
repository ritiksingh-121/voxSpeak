"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "XpService", {
    enumerable: true,
    get: function() {
        return XpService;
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
let XpService = class XpService {
    async addTransaction(userId, amount, reason, referenceId) {
        const [transaction] = await Promise.all([
            this.prisma.xpTransaction.create({
                data: {
                    userId,
                    amount,
                    reason,
                    referenceId
                }
            }),
            this.prisma.profile.update({
                where: {
                    userId
                },
                data: {
                    xp: {
                        increment: amount
                    }
                }
            })
        ]);
        this.logger.log(`Awarded ${amount} XP to user ${userId} for ${reason}`);
        return transaction;
    }
    async getHistory(userId, days) {
        const where = {
            userId
        };
        if (days) {
            const since = new Date();
            since.setDate(since.getDate() - days);
            where.createdAt = {
                gte: since
            };
        }
        return this.prisma.xpTransaction.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getTotalXp(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId
            },
            select: {
                xp: true,
                level: true
            }
        });
        return profile ?? {
            xp: 0,
            level: 1
        };
    }
    async getLevel(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId
            },
            select: {
                level: true,
                xp: true
            }
        });
        if (!profile) return {
            level: 1,
            xp: 0,
            xpForNext: 100,
            progress: 0
        };
        const xpForNext = this.xpRequiredForLevel(profile.level + 1);
        const xpForCurrent = this.xpRequiredForLevel(profile.level);
        const progress = xpForNext - xpForCurrent > 0 ? (profile.xp - xpForCurrent) / (xpForNext - xpForCurrent) : 0;
        return {
            level: profile.level,
            xp: profile.xp,
            xpForNext,
            progress: Math.min(Math.max(progress, 0), 1)
        };
    }
    xpRequiredForLevel(level) {
        return Math.floor(100 * Math.pow(level, 1.5));
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(XpService.name);
    }
};
XpService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], XpService);

//# sourceMappingURL=xp.service.js.map
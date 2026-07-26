"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubscriptionService", {
    enumerable: true,
    get: function() {
        return SubscriptionService;
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
const PLAN_LIMITS = {
    free: {
        dailyMinutes: 30,
        features: [
            'basic_practice',
            'vocabulary',
            'basic_feedback'
        ]
    },
    premium: {
        dailyMinutes: Infinity,
        features: [
            'all'
        ]
    }
};
let SubscriptionService = class SubscriptionService {
    async getCurrentPlan(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                userId
            }
        });
        if (!subscription) {
            return {
                plan: 'free',
                status: 'active',
                limits: PLAN_LIMITS.free,
                features: PLAN_LIMITS.free.features
            };
        }
        const plan = subscription.plan;
        const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
        return {
            ...subscription,
            limits,
            features: limits.features
        };
    }
    async createSubscription(userId, plan, paymentMethodId) {
        if (!PLAN_LIMITS[plan]) {
            throw new _common.BadRequestException(`Invalid plan: ${plan}`);
        }
        const existing = await this.prisma.subscription.findUnique({
            where: {
                userId
            }
        });
        if (existing) {
            return this.prisma.subscription.update({
                where: {
                    userId
                },
                data: {
                    plan,
                    status: 'active',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: this.calculatePeriodEnd(plan)
                }
            });
        }
        return this.prisma.subscription.create({
            data: {
                userId,
                plan,
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: this.calculatePeriodEnd(plan)
            }
        });
    }
    async cancelSubscription(userId) {
        const sub = await this.prisma.subscription.findUnique({
            where: {
                userId
            }
        });
        if (!sub) throw new _common.BadRequestException('No active subscription');
        return this.prisma.subscription.update({
            where: {
                userId
            },
            data: {
                status: 'canceled'
            }
        });
    }
    async handleWebhook(signature, payload) {
        this.logger.log(`Webhook received: ${payload.type}`);
        return {
            received: true
        };
    }
    async checkRateLimit(userId) {
        const plan = await this.getCurrentPlan(userId);
        const dailyLimit = plan.limits.dailyMinutes;
        if (dailyLimit === Infinity) {
            return {
                allowed: true,
                remainingMinutes: Infinity
            };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayConversations = await this.prisma.conversation.aggregate({
            where: {
                userId,
                createdAt: {
                    gte: today
                }
            },
            _sum: {
                durationSecs: true
            }
        });
        const usedMinutes = Math.floor((todayConversations._sum.durationSecs ?? 0) / 60);
        const remainingMinutes = dailyLimit - usedMinutes;
        return {
            allowed: remainingMinutes > 0,
            remainingMinutes: Math.max(remainingMinutes, 0)
        };
    }
    calculatePeriodEnd(plan) {
        const end = new Date();
        end.setMonth(end.getMonth() + 1);
        return end;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(SubscriptionService.name);
    }
};
SubscriptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], SubscriptionService);

//# sourceMappingURL=subscription.service.js.map
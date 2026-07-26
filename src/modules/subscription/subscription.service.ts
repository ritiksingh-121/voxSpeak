import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface PlanLimits {
  dailyMinutes: number;
  features: string[];
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { dailyMinutes: 30, features: ['basic_practice', 'vocabulary', 'basic_feedback'] },
  premium: { dailyMinutes: Infinity, features: ['all'] },
};

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  async getCurrentPlan(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        plan: 'free',
        status: 'active',
        limits: PLAN_LIMITS.free,
        features: PLAN_LIMITS.free.features,
      };
    }

    const plan = subscription.plan;
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    return {
      ...subscription,
      limits,
      features: limits.features,
    };
  }

  async createSubscription(userId: string, plan: string, paymentMethodId?: string) {
    if (!PLAN_LIMITS[plan]) {
      throw new BadRequestException(`Invalid plan: ${plan}`);
    }

    const existing = await this.prisma.subscription.findUnique({ where: { userId } });
    if (existing) {
      return this.prisma.subscription.update({
        where: { userId },
        data: {
          plan,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.calculatePeriodEnd(plan),
        },
      });
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.calculatePeriodEnd(plan),
      },
    });
  }

  async cancelSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) throw new BadRequestException('No active subscription');

    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'canceled' },
    });
  }

  async handleWebhook(signature: string, payload: any) {
    this.logger.log(`Webhook received: ${payload.type}`);
    return { received: true };
  }

  async checkRateLimit(userId: string): Promise<{ allowed: boolean; remainingMinutes: number }> {
    const plan = await this.getCurrentPlan(userId);
    const dailyLimit = plan.limits.dailyMinutes;

    if (dailyLimit === Infinity) {
      return { allowed: true, remainingMinutes: Infinity };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayConversations = await this.prisma.conversation.aggregate({
      where: { userId, createdAt: { gte: today } },
      _sum: { durationSecs: true },
    });

    const usedMinutes = Math.floor((todayConversations._sum.durationSecs ?? 0) / 60);
    const remainingMinutes = dailyLimit - usedMinutes;

    return {
      allowed: remainingMinutes > 0,
      remainingMinutes: Math.max(remainingMinutes, 0),
    };
  }

  private calculatePeriodEnd(plan: string): Date {
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    return end;
  }
}

import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getCurrentPlan(@CurrentUser('id') userId: string) {
    return this.subscriptionService.getCurrentPlan(userId);
  }

  @Post('create')
  async createSubscription(
    @CurrentUser('id') userId: string,
    @Body('plan') plan: string,
    @Body('paymentMethodId') paymentMethodId?: string,
  ) {
    return this.subscriptionService.createSubscription(userId, plan, paymentMethodId);
  }

  @Post('cancel')
  async cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionService.cancelSubscription(userId);
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: any,
  ) {
    return this.subscriptionService.handleWebhook(signature, payload);
  }
}

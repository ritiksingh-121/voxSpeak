"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubscriptionController", {
    enumerable: true,
    get: function() {
        return SubscriptionController;
    }
});
const _common = require("@nestjs/common");
const _subscriptionservice = require("./subscription.service");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _publicdecorator = require("../../common/decorators/public.decorator");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SubscriptionController = class SubscriptionController {
    async getCurrentPlan(userId) {
        return this.subscriptionService.getCurrentPlan(userId);
    }
    async createSubscription(userId, plan, paymentMethodId) {
        return this.subscriptionService.createSubscription(userId, plan, paymentMethodId);
    }
    async cancelSubscription(userId) {
        return this.subscriptionService.cancelSubscription(userId);
    }
    async handleWebhook(signature, payload) {
        return this.subscriptionService.handleWebhook(signature, payload);
    }
    constructor(subscriptionService){
        this.subscriptionService = subscriptionService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getCurrentPlan", null);
_ts_decorate([
    (0, _common.Post)('create'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Body)('plan')),
    _ts_param(2, (0, _common.Body)('paymentMethodId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscriptionController.prototype, "createSubscription", null);
_ts_decorate([
    (0, _common.Post)('cancel'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
_ts_decorate([
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('webhook'),
    _ts_param(0, (0, _common.Headers)('stripe-signature')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscriptionController.prototype, "handleWebhook", null);
SubscriptionController = _ts_decorate([
    (0, _common.Controller)('subscription'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService
    ])
], SubscriptionController);

//# sourceMappingURL=subscription.controller.js.map
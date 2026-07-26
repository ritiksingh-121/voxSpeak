"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationsController", {
    enumerable: true,
    get: function() {
        return NotificationsController;
    }
});
const _common = require("@nestjs/common");
const _notificationsservice = require("./notifications.service");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _paginationdto = require("../../common/dto/pagination.dto");
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
let NotificationsController = class NotificationsController {
    async list(userId, pagination) {
        return this.notificationsService.list(userId, pagination);
    }
    async markAsRead(userId, id) {
        return this.notificationsService.markAsRead(userId, id);
    }
    async markAllAsRead(userId) {
        return this.notificationsService.markAllAsRead(userId);
    }
    constructor(notificationsService){
        this.notificationsService = notificationsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationsController.prototype, "list", null);
_ts_decorate([
    (0, _common.Put)(':id/read'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
_ts_decorate([
    (0, _common.Put)('read-all'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
NotificationsController = _ts_decorate([
    (0, _common.Controller)('notifications'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _notificationsservice.NotificationsService === "undefined" ? Object : _notificationsservice.NotificationsService
    ])
], NotificationsController);

//# sourceMappingURL=notifications.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConversationsController", {
    enumerable: true,
    get: function() {
        return ConversationsController;
    }
});
const _common = require("@nestjs/common");
const _conversationsservice = require("./conversations.service");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _startconversationdto = require("./dto/start-conversation.dto");
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
let ConversationsController = class ConversationsController {
    async start(userId, dto) {
        return this.conversationsService.create(userId, dto);
    }
    async findAll(userId, pagination) {
        return this.conversationsService.findAll(userId, pagination);
    }
    async findOne(userId, id) {
        return this.conversationsService.findOne(userId, id);
    }
    async remove(userId, id) {
        await this.conversationsService.remove(userId, id);
        return {
            message: 'Conversation deleted'
        };
    }
    constructor(conversationsService){
        this.conversationsService = conversationsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _startconversationdto.StartConversationDto === "undefined" ? Object : _startconversationdto.StartConversationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsController.prototype, "start", null);
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
], ConversationsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsController.prototype, "remove", null);
ConversationsController = _ts_decorate([
    (0, _common.Controller)('conversations'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _conversationsservice.ConversationsService === "undefined" ? Object : _conversationsservice.ConversationsService
    ])
], ConversationsController);

//# sourceMappingURL=conversations.controller.js.map
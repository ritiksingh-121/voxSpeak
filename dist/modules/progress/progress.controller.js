"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProgressController", {
    enumerable: true,
    get: function() {
        return ProgressController;
    }
});
const _common = require("@nestjs/common");
const _progressservice = require("./progress.service");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
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
let ProgressController = class ProgressController {
    async getOverview(userId) {
        return this.progressService.getOverview(userId);
    }
    async getPronunciation(userId) {
        return this.progressService.getPronunciationStats(userId);
    }
    async getGrammar(userId) {
        return this.progressService.getGrammarStats(userId);
    }
    async getVocabulary(userId) {
        return this.progressService.getVocabularyStats(userId);
    }
    constructor(progressService){
        this.progressService = progressService;
    }
};
_ts_decorate([
    (0, _common.Get)('overview'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ProgressController.prototype, "getOverview", null);
_ts_decorate([
    (0, _common.Get)('pronunciation'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ProgressController.prototype, "getPronunciation", null);
_ts_decorate([
    (0, _common.Get)('grammar'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ProgressController.prototype, "getGrammar", null);
_ts_decorate([
    (0, _common.Get)('vocabulary'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ProgressController.prototype, "getVocabulary", null);
ProgressController = _ts_decorate([
    (0, _common.Controller)('progress'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _progressservice.ProgressService === "undefined" ? Object : _progressservice.ProgressService
    ])
], ProgressController);

//# sourceMappingURL=progress.controller.js.map
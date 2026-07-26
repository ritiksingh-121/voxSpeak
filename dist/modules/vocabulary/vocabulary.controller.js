"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VocabularyController", {
    enumerable: true,
    get: function() {
        return VocabularyController;
    }
});
const _common = require("@nestjs/common");
const _vocabularyservice = require("./vocabulary.service");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _saveworddto = require("./dto/save-word.dto");
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
let VocabularyController = class VocabularyController {
    async findAll(userId, pagination, search, status, difficulty) {
        return this.vocabularyService.findAll(userId, {
            ...pagination,
            search,
            status,
            difficulty
        });
    }
    async save(userId, dto) {
        return this.vocabularyService.save(userId, dto);
    }
    async update(userId, id, dto) {
        return this.vocabularyService.update(userId, id, dto);
    }
    async remove(userId, id) {
        await this.vocabularyService.remove(userId, id);
        return {
            message: 'Word deleted'
        };
    }
    async getWeakWords(userId) {
        return this.vocabularyService.getWeakWords(userId);
    }
    constructor(vocabularyService){
        this.vocabularyService = vocabularyService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Query)()),
    _ts_param(2, (0, _common.Query)('search')),
    _ts_param(3, (0, _common.Query)('status')),
    _ts_param(4, (0, _common.Query)('difficulty')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VocabularyController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _saveworddto.SaveWordDto === "undefined" ? Object : _saveworddto.SaveWordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], VocabularyController.prototype, "save", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", Promise)
], VocabularyController.prototype, "update", null);
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
], VocabularyController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Get)('weak'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], VocabularyController.prototype, "getWeakWords", null);
VocabularyController = _ts_decorate([
    (0, _common.Controller)('vocabulary'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _vocabularyservice.VocabularyService === "undefined" ? Object : _vocabularyservice.VocabularyService
    ])
], VocabularyController);

//# sourceMappingURL=vocabulary.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VoiceController", {
    enumerable: true,
    get: function() {
        return VoiceController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _voiceservice = require("./voice.service");
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
let VoiceController = class VoiceController {
    async upload(userId, file) {
        if (!file) throw new _common.BadRequestException('Audio file is required');
        return this.voiceService.uploadAudio(userId, file);
    }
    async analyze(userId, data) {
        if (!data.recordingId) throw new _common.BadRequestException('recordingId is required');
        return this.voiceService.analyzeAudio(userId, data.recordingId);
    }
    constructor(voiceService){
        this.voiceService = voiceService;
    }
};
_ts_decorate([
    (0, _common.Post)('upload'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], VoiceController.prototype, "upload", null);
_ts_decorate([
    (0, _common.Post)('analyze'),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], VoiceController.prototype, "analyze", null);
VoiceController = _ts_decorate([
    (0, _common.Controller)('voice'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _voiceservice.VoiceService === "undefined" ? Object : _voiceservice.VoiceService
    ])
], VoiceController);

//# sourceMappingURL=voice.controller.js.map
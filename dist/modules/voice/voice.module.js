"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VoiceModule", {
    enumerable: true,
    get: function() {
        return VoiceModule;
    }
});
const _common = require("@nestjs/common");
const _voicecontroller = require("./voice.controller");
const _voiceservice = require("./voice.service");
const _voiceprocessor = require("./voice.processor");
const _storagemodule = require("../../storage/storage.module");
const _queuemodule = require("../../queue/queue.module");
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
let VoiceModule = class VoiceModule {
};
VoiceModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _storagemodule.StorageModule,
            _queuemodule.QueueModule
        ],
        controllers: [
            _voicecontroller.VoiceController
        ],
        providers: [
            _voiceservice.VoiceService,
            _voiceprocessor.VoiceProcessor
        ],
        exports: [
            _voiceservice.VoiceService
        ]
    })
], VoiceModule);

//# sourceMappingURL=voice.module.js.map
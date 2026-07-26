"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConversationsModule", {
    enumerable: true,
    get: function() {
        return ConversationsModule;
    }
});
const _common = require("@nestjs/common");
const _conversationscontroller = require("./conversations.controller");
const _conversationsservice = require("./conversations.service");
const _conversationsgateway = require("./conversations.gateway");
const _aimodule = require("../ai/ai.module");
const _voicemodule = require("../voice/voice.module");
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
let ConversationsModule = class ConversationsModule {
};
ConversationsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _aimodule.AiModule,
            _voicemodule.VoiceModule
        ],
        controllers: [
            _conversationscontroller.ConversationsController
        ],
        providers: [
            _conversationsservice.ConversationsService,
            _conversationsgateway.ConversationsGateway
        ],
        exports: [
            _conversationsservice.ConversationsService
        ]
    })
], ConversationsModule);

//# sourceMappingURL=conversations.module.js.map
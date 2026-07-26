"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _configmodule = require("./config/config.module");
const _authmodule = require("./modules/auth/auth.module");
const _usersmodule = require("./modules/users/users.module");
const _conversationsmodule = require("./modules/conversations/conversations.module");
const _voicemodule = require("./modules/voice/voice.module");
const _aimodule = require("./modules/ai/ai.module");
const _vocabularymodule = require("./modules/vocabulary/vocabulary.module");
const _progressmodule = require("./modules/progress/progress.module");
const _gamificationmodule = require("./modules/gamification/gamification.module");
const _notificationsmodule = require("./modules/notifications/notifications.module");
const _subscriptionmodule = require("./modules/subscription/subscription.module");
const _queuemodule = require("./queue/queue.module");
const _storagemodule = require("./storage/storage.module");
const _searchmodule = require("./search/search.module");
const _prismamodule = require("./prisma/prisma.module");
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
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true
            }),
            _configmodule.AppConfigModule,
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _conversationsmodule.ConversationsModule,
            _voicemodule.VoiceModule,
            _aimodule.AiModule,
            _vocabularymodule.VocabularyModule,
            _progressmodule.ProgressModule,
            _gamificationmodule.GamificationModule,
            _notificationsmodule.NotificationsModule,
            _subscriptionmodule.SubscriptionModule,
            _queuemodule.QueueModule,
            _storagemodule.StorageModule,
            _searchmodule.SearchModule,
            _prismamodule.PrismaModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GamificationModule", {
    enumerable: true,
    get: function() {
        return GamificationModule;
    }
});
const _common = require("@nestjs/common");
const _gamificationservice = require("./gamification.service");
const _xpservice = require("./xp.service");
const _achievementservice = require("./achievement.service");
const _streakservice = require("./streak.service");
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
let GamificationModule = class GamificationModule {
};
GamificationModule = _ts_decorate([
    (0, _common.Module)({
        providers: [
            _gamificationservice.GamificationService,
            _xpservice.XpService,
            _achievementservice.AchievementService,
            _streakservice.StreakService
        ],
        exports: [
            _gamificationservice.GamificationService,
            _xpservice.XpService,
            _achievementservice.AchievementService,
            _streakservice.StreakService
        ]
    })
], GamificationModule);

//# sourceMappingURL=gamification.module.js.map
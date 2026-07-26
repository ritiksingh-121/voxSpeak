"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LeaderboardController", {
    enumerable: true,
    get: function() {
        return LeaderboardController;
    }
});
const _common = require("@nestjs/common");
const _leaderboardservice = require("./leaderboard.service");
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
let LeaderboardController = class LeaderboardController {
    async getLeaderboard(period, limit, userId) {
        const topUsers = await this.leaderboardService.getTopUsers(period, limit);
        const currentUserRank = await this.leaderboardService.getUserRank(userId, period);
        return {
            topUsers,
            currentUserRank
        };
    }
    constructor(leaderboardService){
        this.leaderboardService = leaderboardService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('period', new _common.DefaultValuePipe('weekly'))),
    _ts_param(1, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getLeaderboard", null);
LeaderboardController = _ts_decorate([
    (0, _common.Controller)('leaderboard'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _leaderboardservice.LeaderboardService === "undefined" ? Object : _leaderboardservice.LeaderboardService
    ])
], LeaderboardController);

//# sourceMappingURL=leaderboard.controller.js.map
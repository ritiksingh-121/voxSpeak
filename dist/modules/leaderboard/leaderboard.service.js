"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LeaderboardService", {
    enumerable: true,
    get: function() {
        return LeaderboardService;
    }
});
const _common = require("@nestjs/common");
const _ioredis = /*#__PURE__*/ _interop_require_default(require("ioredis"));
const _configservice = require("../../config/config.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
let LeaderboardService = class LeaderboardService {
    getKey(period) {
        switch(period){
            case 'weekly':
                return this.weeklyKey;
            case 'monthly':
                return this.monthlyKey;
            default:
                return this.allTimeKey;
        }
    }
    async addScore(userId, xp) {
        const now = Date.now();
        const weekStart = this.getWeekStart();
        const monthStart = this.getMonthStart();
        await Promise.all([
            this.redis.zadd(this.allTimeKey, xp, userId),
            this.redis.zadd(`${this.weeklyKey}:${weekStart}`, xp, userId),
            this.redis.zadd(`${this.monthlyKey}:${monthStart}`, xp, userId)
        ]);
        await Promise.all([
            this.redis.expire(`${this.weeklyKey}:${weekStart}`, 7 * 24 * 60 * 60),
            this.redis.expire(`${this.monthlyKey}:${monthStart}`, 31 * 24 * 60 * 60)
        ]);
    }
    async getTopUsers(period, limit = 10) {
        const key = this.getKey(period);
        if (period === 'weekly') {
            const weekStart = this.getWeekStart();
            const result = await this.redis.zrevrange(`${this.weeklyKey}:${weekStart}`, 0, limit - 1, 'WITHSCORES');
            return this.formatResults(result, "weekly");
        }
        if (period === 'monthly') {
            const monthStart = this.getMonthStart();
            const result = await this.redis.zrevrange(`${this.monthlyKey}:${monthStart}`, 0, limit - 1, 'WITHSCORES');
            return this.formatResults(result, "monthly");
        }
        const result = await this.redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
        return this.formatResults(result, "all");
    }
    async getUserRank(userId, period) {
        const key = period === 'weekly' ? `${this.weeklyKey}:${this.getWeekStart()}` : period === 'monthly' ? `${this.monthlyKey}:${this.getMonthStart()}` : this.allTimeKey;
        const [rank, score] = await Promise.all([
            this.redis.zrevrank(key, userId),
            this.redis.zscore(key, userId)
        ]);
        return {
            userId,
            rank: rank !== null ? rank + 1 : null,
            score: score ? Number(score) : 0,
            period
        };
    }
    formatResults(data, type) {
        const results = [];
        for(let i = 0; i < data.length; i += 2){
            results.push({
                userId: data[i],
                score: Number(data[i + 1]),
                rank: i / 2 + 1,
                period: type
            });
        }
        return results;
    }
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
    }
    getMonthStart() {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        return first.toISOString().split('T')[0];
    }
    constructor(config){
        this.config = config;
        this.logger = new _common.Logger(LeaderboardService.name);
        this.weeklyKey = 'leaderboard:weekly';
        this.monthlyKey = 'leaderboard:monthly';
        this.allTimeKey = 'leaderboard:alltime';
        this.redis = new _ioredis.default({
            host: config.redisHost,
            port: config.redisPort,
            password: config.redisPassword || undefined
        });
    }
};
LeaderboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], LeaderboardService);
var PeriodType = /*#__PURE__*/ function(PeriodType) {
    PeriodType["Weekly"] = "weekly";
    PeriodType["Monthly"] = "monthly";
    PeriodType["AllTime"] = "all";
    return PeriodType;
}(PeriodType || {});

//# sourceMappingURL=leaderboard.service.js.map
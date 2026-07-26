"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ThrottleGuard", {
    enumerable: true,
    get: function() {
        return ThrottleGuard;
    }
});
const _common = require("@nestjs/common");
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
let ThrottleGuard = class ThrottleGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const key = request.ip || 'unknown';
        const now = Date.now();
        const entry = this.store.get(key);
        if (!entry || now > entry.resetAt) {
            this.store.set(key, {
                count: 1,
                resetAt: now + this.windowMs
            });
            return true;
        }
        if (entry.count >= this.maxRequests) {
            throw new _common.HttpException('Too many requests', _common.HttpStatus.TOO_MANY_REQUESTS);
        }
        entry.count++;
        return true;
    }
    constructor(){
        this.store = new Map();
        this.windowMs = 60_000;
        this.maxRequests = 60;
    }
};
ThrottleGuard = _ts_decorate([
    (0, _common.Injectable)()
], ThrottleGuard);

//# sourceMappingURL=throttle.guard.js.map
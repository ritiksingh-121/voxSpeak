"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransformInterceptor", {
    enumerable: true,
    get: function() {
        return TransformInterceptor;
    }
});
const _common = require("@nestjs/common");
const _operators = require("rxjs/operators");
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
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, _operators.map)((data)=>{
            if (data && typeof data === 'object' && 'success' in data) {
                return data;
            }
            const meta = {};
            if (data && typeof data === 'object') {
                if ('meta' in data) {
                    Object.assign(meta, data.meta);
                    delete data.meta;
                }
                if ('data' in data) {
                    return {
                        success: true,
                        data: data.data,
                        meta: {
                            ...meta,
                            ...data.meta
                        }
                    };
                }
            }
            return {
                success: true,
                data,
                meta: Object.keys(meta).length > 0 ? meta : undefined
            };
        }));
    }
};
TransformInterceptor = _ts_decorate([
    (0, _common.Injectable)()
], TransformInterceptor);

//# sourceMappingURL=transform.interceptor.js.map
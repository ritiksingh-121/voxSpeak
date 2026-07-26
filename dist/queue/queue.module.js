"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QueueModule", {
    enumerable: true,
    get: function() {
        return QueueModule;
    }
});
const _common = require("@nestjs/common");
const _bullmq = require("@nestjs/bullmq");
const _queueservice = require("./queue.service");
const _configservice = require("../config/config.service");
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
let QueueModule = class QueueModule {
    onModuleInit() {
        this.logger.log('Queue module initialized with queues: stt, tts, ai, analysis, notification');
    }
    constructor(){
        this.logger = new _common.Logger(QueueModule.name);
    }
};
QueueModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _bullmq.BullModule.forRootAsync({
                useFactory: (config)=>({
                        connection: {
                            host: config.redisHost,
                            port: config.redisPort,
                            password: config.redisPassword || undefined
                        }
                    }),
                inject: [
                    _configservice.AppConfigService
                ]
            }),
            _bullmq.BullModule.registerQueue({
                name: 'stt-queue'
            }, {
                name: 'tts-queue'
            }, {
                name: 'ai-queue'
            }, {
                name: 'analysis-queue'
            }, {
                name: 'notification-queue'
            })
        ],
        providers: [
            _queueservice.QueueService
        ],
        exports: [
            _queueservice.QueueService,
            _bullmq.BullModule
        ]
    })
], QueueModule);

//# sourceMappingURL=queue.module.js.map
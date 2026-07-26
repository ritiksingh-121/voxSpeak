"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiProcessor", {
    enumerable: true,
    get: function() {
        return AiProcessor;
    }
});
const _bullmq = require("@nestjs/bullmq");
const _common = require("@nestjs/common");
const _aiservice = require("./ai.service");
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
let AiProcessor = class AiProcessor extends _bullmq.WorkerHost {
    async process(job) {
        const { userId, conversationId, message, type } = job.data;
        this.logger.log(`Processing AI job ${job.id} type=${type}`);
        try {
            switch(type){
                case 'response':
                    return this.aiService.generateResponse(userId, conversationId, message);
                case 'feedback':
                    return this.aiService.generateFeedback(userId, conversationId);
                case 'grammar':
                    return this.aiService.generateResponse(userId, conversationId, message);
                default:
                    throw new Error(`Unknown AI job type: ${type}`);
            }
        } catch (error) {
            this.logger.error(`AI job ${job.id} failed: ${error.message}`);
            throw error;
        }
    }
    constructor(aiService){
        super(), this.aiService = aiService, this.logger = new _common.Logger(AiProcessor.name);
    }
};
AiProcessor = _ts_decorate([
    (0, _bullmq.Processor)('ai'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aiservice.AiService === "undefined" ? Object : _aiservice.AiService
    ])
], AiProcessor);

//# sourceMappingURL=ai.processor.js.map
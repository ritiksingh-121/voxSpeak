"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "QueueService", {
    enumerable: true,
    get: function() {
        return QueueService;
    }
});
const _common = require("@nestjs/common");
const _bullmq = require("@nestjs/bullmq");
const _bullmq1 = require("bullmq");
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
let QueueService = class QueueService {
    async addSttJob(audioBuffer, metadata) {
        const job = await this.sttQueue.add('transcribe', {
            audioBuffer: audioBuffer.toString('base64'),
            metadata
        });
        this.logger.log(`STT job ${job.id} added`);
        return job;
    }
    async addTtsJob(text, voice, metadata) {
        const job = await this.ttsQueue.add('synthesize', {
            text,
            voice: voice || 'en-US-Neural2-D',
            metadata
        });
        this.logger.log(`TTS job ${job.id} added`);
        return job;
    }
    async addAiJob(prompt, context, metadata) {
        const job = await this.aiQueue.add('process', {
            prompt,
            context,
            metadata
        });
        this.logger.log(`AI job ${job.id} added`);
        return job;
    }
    async addAnalysisJob(conversationId, metadata) {
        const job = await this.analysisQueue.add('analyze', {
            conversationId,
            metadata
        });
        this.logger.log(`Analysis job ${job.id} added for conversation ${conversationId}`);
        return job;
    }
    async addNotificationJob(userId, notification) {
        const job = await this.notificationQueue.add('send', {
            userId,
            notification
        });
        this.logger.log(`Notification job ${job.id} added for user ${userId}`);
        return job;
    }
    constructor(sttQueue, ttsQueue, aiQueue, analysisQueue, notificationQueue){
        this.sttQueue = sttQueue;
        this.ttsQueue = ttsQueue;
        this.aiQueue = aiQueue;
        this.analysisQueue = analysisQueue;
        this.notificationQueue = notificationQueue;
        this.logger = new _common.Logger(QueueService.name);
    }
};
QueueService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _bullmq.InjectQueue)('stt-queue')),
    _ts_param(1, (0, _bullmq.InjectQueue)('tts-queue')),
    _ts_param(2, (0, _bullmq.InjectQueue)('ai-queue')),
    _ts_param(3, (0, _bullmq.InjectQueue)('analysis-queue')),
    _ts_param(4, (0, _bullmq.InjectQueue)('notification-queue')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue,
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue,
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue,
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue,
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue
    ])
], QueueService);

//# sourceMappingURL=queue.service.js.map
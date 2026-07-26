"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VoiceService", {
    enumerable: true,
    get: function() {
        return VoiceService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _storageservice = require("../../storage/storage.service");
const _queueservice = require("../../queue/queue.service");
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
let VoiceService = class VoiceService {
    async uploadAudio(userId, file) {
        const key = `recordings/${userId}/${Date.now()}-${file.originalname}`;
        const recording = await this.prisma.voiceRecording.create({
            data: {
                userId,
                filePath: key,
                format: file.mimetype?.split('/')[1] || 'webm',
                durationMs: 0,
                fileSizeBytes: file.size
            }
        });
        return recording;
    }
    async analyzeAudio(userId, recordingId) {
        const recording = await this.prisma.voiceRecording.findUnique({
            where: {
                id: recordingId
            }
        });
        if (!recording) throw new _common.NotFoundException('Recording not found');
        if (recording.userId !== userId) throw new _common.NotFoundException('Recording not found');
        if (!recording.transcript) {
            throw new _common.NotFoundException('Transcription not ready');
        }
        return {
            transcription: recording.transcript,
            duration: recording.durationMs
        };
    }
    async updateTranscription(recordingId, transcription, _confidence, _duration, _analysis) {
        await this.prisma.voiceRecording.update({
            where: {
                id: recordingId
            },
            data: {
                transcript: transcription,
                durationMs: _duration
            }
        });
    }
    constructor(prisma, storage, queue){
        this.prisma = prisma;
        this.storage = storage;
        this.queue = queue;
        this.logger = new _common.Logger(VoiceService.name);
    }
};
VoiceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _storageservice.StorageService === "undefined" ? Object : _storageservice.StorageService,
        typeof _queueservice.QueueService === "undefined" ? Object : _queueservice.QueueService
    ])
], VoiceService);

//# sourceMappingURL=voice.service.js.map
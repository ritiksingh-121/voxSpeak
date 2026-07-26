"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VoiceProcessor", {
    enumerable: true,
    get: function() {
        return VoiceProcessor;
    }
});
const _bullmq = require("@nestjs/bullmq");
const _common = require("@nestjs/common");
const _voiceservice = require("./voice.service");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
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
let VoiceProcessor = class VoiceProcessor extends _bullmq.WorkerHost {
    async process(job) {
        const { recordingId, fileUrl } = job.data;
        this.logger.log(`Processing STT for recording ${recordingId}`);
        try {
            const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
            const response = await _axios.default.post(`${ollamaUrl}/api/transcribe`, {
                url: fileUrl,
                model: 'whisper'
            });
            const transcription = response.data.text || '';
            const confidence = response.data.confidence || 0;
            const duration = response.data.duration || 0;
            await this.voiceService.updateTranscription(recordingId, transcription, confidence, duration, {
                source: 'ollama-whisper',
                model: 'whisper'
            });
            this.logger.log(`STT completed for recording ${recordingId}`);
        } catch (error) {
            this.logger.error(`STT failed for recording ${recordingId}: ${error.message}`);
            throw error;
        }
    }
    constructor(voiceService){
        super(), this.voiceService = voiceService, this.logger = new _common.Logger(VoiceProcessor.name);
    }
};
VoiceProcessor = _ts_decorate([
    (0, _bullmq.Processor)('stt'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _voiceservice.VoiceService === "undefined" ? Object : _voiceservice.VoiceService
    ])
], VoiceProcessor);

//# sourceMappingURL=voice.processor.js.map
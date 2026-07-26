"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LlmService", {
    enumerable: true,
    get: function() {
        return LlmService;
    }
});
const _common = require("@nestjs/common");
const _configservice = require("../../config/config.service");
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
let LlmService = class LlmService {
    async chat(systemPrompt, history, userMessage, quick = false) {
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...history.slice(-10).map((h)=>({
                    role: h.role,
                    content: h.content
                })),
            {
                role: 'user',
                content: userMessage
            }
        ];
        try {
            const response = await this.client.post('/api/chat', {
                model: quick ? 'llama3:8b' : this.config.ollamaModel,
                messages,
                stream: false,
                options: {
                    temperature: quick ? 0.3 : 0.7,
                    top_p: 0.9
                }
            });
            return response.data.message?.content || '';
        } catch (error) {
            this.logger.error(`Ollama chat failed: ${error.message}`);
            throw new Error(`AI service unavailable: ${error.message}`);
        }
    }
    async chatSimple(prompt) {
        try {
            const response = await this.client.post('/api/chat', {
                model: this.config.ollamaModel,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                stream: false
            });
            return response.data.message?.content || '';
        } catch (error) {
            this.logger.error(`Ollama simple chat failed: ${error.message}`);
            throw new Error(`AI service unavailable: ${error.message}`);
        }
    }
    async chatStream(systemPrompt, messages, onToken) {
        try {
            const response = await this.client.post('/api/chat', {
                model: this.config.ollamaModel,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    ...messages
                ],
                stream: true
            }, {
                responseType: 'stream'
            });
            response.data.on('data', (chunk)=>{
                const lines = chunk.toString().split('\n').filter(Boolean);
                for (const line of lines){
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.message?.content) {
                            onToken(parsed.message.content);
                        }
                    } catch  {}
                }
            });
        } catch (error) {
            this.logger.error(`Ollama stream failed: ${error.message}`);
            throw new Error(`AI streaming unavailable: ${error.message}`);
        }
    }
    constructor(config){
        this.config = config;
        this.logger = new _common.Logger(LlmService.name);
        this.client = _axios.default.create({
            baseURL: this.config.ollamaUrl,
            timeout: 60000
        });
    }
};
LlmService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], LlmService);

//# sourceMappingURL=llm.service.js.map
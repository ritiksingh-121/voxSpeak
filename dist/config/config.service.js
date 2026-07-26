"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppConfigService", {
    enumerable: true,
    get: function() {
        return AppConfigService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
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
let AppConfigService = class AppConfigService {
    get port() {
        return Number(this.configService.get('PORT', 3001));
    }
    get jwtSecret() {
        return this.configService.get('JWT_SECRET', 'voxspeak-dev-secret');
    }
    get jwtExpiresIn() {
        return this.configService.get('JWT_EXPIRES_IN', '7d');
    }
    get jwtRefreshExpiresIn() {
        return this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d');
    }
    get googleClientId() {
        return this.configService.get('GOOGLE_CLIENT_ID', '');
    }
    get googleClientSecret() {
        return this.configService.get('GOOGLE_CLIENT_SECRET', '');
    }
    get githubClientId() {
        return this.configService.get('GITHUB_CLIENT_ID', '');
    }
    get githubClientSecret() {
        return this.configService.get('GITHUB_CLIENT_SECRET', '');
    }
    get redisHost() {
        return this.configService.get('REDIS_HOST', 'localhost');
    }
    get redisPort() {
        return Number(this.configService.get('REDIS_PORT', 6379));
    }
    get redisPassword() {
        return this.configService.get('REDIS_PASSWORD', '');
    }
    get minioEndpoint() {
        return this.configService.get('MINIO_ENDPOINT', 'localhost');
    }
    get minioPort() {
        return Number(this.configService.get('MINIO_PORT', 9000));
    }
    get minioAccessKey() {
        return this.configService.get('MINIO_ACCESS_KEY', 'minioadmin');
    }
    get minioSecretKey() {
        return this.configService.get('MINIO_SECRET_KEY', 'minioadmin');
    }
    get minioBucket() {
        return this.configService.get('MINIO_BUCKET', 'voxspeak');
    }
    get minioUseSsl() {
        return this.configService.get('MINIO_USE_SSL', 'false') === 'true';
    }
    get qdrantUrl() {
        return this.configService.get('QDRANT_URL', 'http://localhost:6333');
    }
    get qdrantApiKey() {
        return this.configService.get('QDRANT_API_KEY', '');
    }
    get ollamaUrl() {
        return this.configService.get('OLLAMA_URL', 'http://localhost:11434');
    }
    get ollamaModel() {
        return this.configService.get('OLLAMA_MODEL', 'llama3');
    }
    get corsOrigin() {
        const origin = this.configService.get('CORS_ORIGIN', 'http://localhost:3000');
        return origin.split(',').map((o)=>o.trim());
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/voxspeak');
    }
    constructor(configService){
        this.configService = configService;
    }
};
AppConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AppConfigService);

//# sourceMappingURL=config.service.js.map
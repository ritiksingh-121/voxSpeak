"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StorageService", {
    enumerable: true,
    get: function() {
        return StorageService;
    }
});
const _common = require("@nestjs/common");
const _minio = /*#__PURE__*/ _interop_require_wildcard(require("minio"));
const _configservice = require("../config/config.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
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
let StorageService = class StorageService {
    async onModuleInit() {
        try {
            await this.ensureBucket(this.config.minioBucket);
            this.logger.log(`Storage service initialized, bucket: ${this.config.minioBucket}`);
        } catch (err) {
            this.logger.warn(`Failed to initialize storage bucket: ${err}`);
        }
    }
    async uploadBuffer(bucket, key, buffer, contentType) {
        await this.ensureBucket(bucket);
        const metaData = {};
        if (contentType) metaData['Content-Type'] = contentType;
        return new Promise((resolve, reject)=>{
            this.client.putObject(bucket, key, buffer, buffer.length, metaData, (err)=>{
                if (err) {
                    this.logger.error(`Failed to upload ${key} to ${bucket}: ${err.message}`);
                    reject(err);
                } else {
                    this.logger.log(`Uploaded ${key} to ${bucket}`);
                    resolve(key);
                }
            });
        });
    }
    async getFileUrl(bucket, key) {
        const exists = await this.client.bucketExists(bucket);
        if (!exists) throw new Error(`Bucket ${bucket} does not exist`);
        return new Promise((resolve, reject)=>{
            this.client.presignedGetObject(bucket, key, 24 * 60 * 60, (err, url)=>{
                if (err) reject(err);
                else resolve(url);
            });
        });
    }
    async deleteFile(bucket, key) {
        await this.client.removeObject(bucket, key);
        this.logger.log(`Deleted ${key} from ${bucket}`);
    }
    async ensureBucket(bucketName) {
        const exists = await this.client.bucketExists(bucketName);
        if (!exists) {
            await this.client.makeBucket(bucketName, 'us-east-1');
            this.logger.log(`Created bucket: ${bucketName}`);
        }
    }
    constructor(config){
        this.config = config;
        this.logger = new _common.Logger(StorageService.name);
        this.client = new _minio.Client({
            endPoint: config.minioEndpoint,
            port: config.minioPort,
            useSSL: config.minioUseSsl,
            accessKey: config.minioAccessKey,
            secretKey: config.minioSecretKey
        });
    }
};
StorageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], StorageService);

//# sourceMappingURL=storage.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchService", {
    enumerable: true,
    get: function() {
        return SearchService;
    }
});
const _common = require("@nestjs/common");
const _jsclientrest = require("@qdrant/js-client-rest");
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
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
let SearchService = class SearchService {
    async upsertVector(collection, id, vector, payload) {
        await this.ensureCollection(collection, vector.length);
        await this.client.upsert(collection, {
            points: [
                {
                    id,
                    vector,
                    payload: payload ?? {}
                }
            ]
        });
        this.logger.log(`Upserted vector ${id} in collection ${collection}`);
    }
    async searchSimilar(collection, vector, limit = 10, filter) {
        const result = await this.client.search(collection, {
            vector,
            limit,
            filter: filter,
            with_payload: true
        });
        return result.map((r)=>({
                id: r.id,
                score: r.score,
                payload: r.payload
            }));
    }
    async deleteVector(collection, id) {
        await this.client.delete(collection, {
            points: [
                id
            ]
        });
        this.logger.log(`Deleted vector ${id} from collection ${collection}`);
    }
    async createCollection(collection, config) {
        const collections = await this.client.getCollections();
        const exists = collections.collections.some((c)=>c.name === collection);
        if (!exists) {
            await this.client.createCollection(collection, {
                vectors: {
                    size: config.size,
                    distance: config.distance
                }
            });
            this.logger.log(`Created collection ${collection}`);
        }
        return {
            collection,
            exists
        };
    }
    async ensureCollection(collection, vectorSize) {
        try {
            const collections = await this.client.getCollections();
            const exists = collections.collections.some((c)=>c.name === collection);
            if (!exists) {
                await this.createCollection(collection, {
                    size: vectorSize,
                    distance: 'Cosine'
                });
            }
        } catch (err) {
            this.logger.warn(`Could not verify collection ${collection}: ${err}`);
        }
    }
    constructor(config){
        this.config = config;
        this.logger = new _common.Logger(SearchService.name);
        this.client = new _jsclientrest.QdrantClient({
            url: config.qdrantUrl,
            apiKey: config.qdrantApiKey || undefined
        });
    }
};
SearchService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], SearchService);

//# sourceMappingURL=search.service.js.map
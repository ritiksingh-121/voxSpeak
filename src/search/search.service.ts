import { Injectable, Logger } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private client: QdrantClient;

  constructor(private config: AppConfigService) {
    this.client = new QdrantClient({
      url: config.qdrantUrl,
      apiKey: config.qdrantApiKey || undefined,
    });
  }

  async upsertVector(collection: string, id: string, vector: number[], payload?: Record<string, any>) {
    await this.ensureCollection(collection, vector.length);

    await this.client.upsert(collection, {
      points: [
        {
          id,
          vector,
          payload: payload ?? {},
        },
      ],
    });

    this.logger.log(`Upserted vector ${id} in collection ${collection}`);
  }

  async searchSimilar(collection: string, vector: number[], limit: number = 10, filter?: Record<string, any>) {
    const result = await this.client.search(collection, {
      vector,
      limit,
      filter: filter as any,
      with_payload: true,
    });

    return result.map(r => ({
      id: r.id,
      score: r.score,
      payload: r.payload,
    }));
  }

  async deleteVector(collection: string, id: string) {
    await this.client.delete(collection, {
      points: [id],
    });
    this.logger.log(`Deleted vector ${id} from collection ${collection}`);
  }

  async createCollection(collection: string, config: { size: number; distance: 'Cosine' | 'Euclid' | 'Dot' }) {
    const collections = await this.client.getCollections();
    const exists = collections.collections.some(c => c.name === collection);
    if (!exists) {
      await this.client.createCollection(collection, {
        vectors: {
          size: config.size,
          distance: config.distance,
        },
      });
      this.logger.log(`Created collection ${collection}`);
    }
    return { collection, exists };
  }

  private async ensureCollection(collection: string, vectorSize: number) {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === collection);
      if (!exists) {
        await this.createCollection(collection, { size: vectorSize, distance: 'Cosine' });
      }
    } catch (err) {
      this.logger.warn(`Could not verify collection ${collection}: ${err}`);
    }
  }
}

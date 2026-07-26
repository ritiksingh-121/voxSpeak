"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VocabularyService", {
    enumerable: true,
    get: function() {
        return VocabularyService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
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
let VocabularyService = class VocabularyService {
    async findAll(userId, query) {
        const where = {
            userId
        };
        if (query.search) {
            where.word = {
                contains: query.search,
                mode: 'insensitive'
            };
        }
        if (query.status) where.status = query.status;
        if (query.difficulty) where.difficulty = query.difficulty;
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.vocabularyItem.findMany({
                where,
                orderBy: {
                    lastReviewed: {
                        sort: 'asc',
                        nulls: 'last'
                    }
                },
                skip,
                take: limit
            }),
            this.prisma.vocabularyItem.count({
                where
            })
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async save(userId, dto) {
        const existing = await this.prisma.vocabularyItem.findUnique({
            where: {
                userId_word: {
                    userId,
                    word: dto.word.toLowerCase().trim()
                }
            }
        });
        if (existing) throw new _common.ConflictException('Word already exists in your vocabulary');
        return this.prisma.vocabularyItem.create({
            data: {
                userId,
                word: dto.word.toLowerCase().trim(),
                definition: dto.definition,
                exampleSentence: dto.exampleSentence,
                context: dto.context,
                nextReview: this.calculateNextReview(new Date(), 0)
            }
        });
    }
    async update(userId, id, dto) {
        const item = await this.prisma.vocabularyItem.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!item) throw new _common.NotFoundException('Vocabulary item not found');
        return this.prisma.vocabularyItem.update({
            where: {
                id
            },
            data: {
                ...dto.word && {
                    word: dto.word.toLowerCase().trim()
                },
                ...dto.definition !== undefined && {
                    definition: dto.definition
                },
                ...dto.exampleSentence !== undefined && {
                    exampleSentence: dto.exampleSentence
                },
                ...dto.context !== undefined && {
                    context: dto.context
                }
            }
        });
    }
    async remove(userId, id) {
        const item = await this.prisma.vocabularyItem.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!item) throw new _common.NotFoundException('Vocabulary item not found');
        await this.prisma.vocabularyItem.delete({
            where: {
                id
            }
        });
    }
    async getWeakWords(userId) {
        const items = await this.prisma.vocabularyItem.findMany({
            where: {
                userId,
                OR: [
                    {
                        status: 'learning'
                    },
                    {
                        nextReview: {
                            lte: new Date()
                        }
                    }
                ]
            },
            orderBy: {
                timesWrong: 'desc'
            },
            take: 20
        });
        return items;
    }
    async extractFromConversation(userId, conversationId, words) {
        const saved = [];
        for (const word of words){
            try {
                const item = await this.prisma.vocabularyItem.upsert({
                    where: {
                        userId_word: {
                            userId,
                            word: word.toLowerCase().trim()
                        }
                    },
                    update: {
                        timesEncountered: {
                            increment: 1
                        },
                        context: `Extracted from conversation ${conversationId}`
                    },
                    create: {
                        userId,
                        word: word.toLowerCase().trim(),
                        context: `Extracted from conversation ${conversationId}`,
                        timesEncountered: 1
                    }
                });
                saved.push(item);
            } catch (e) {
                this.logger.warn(`Failed to save word ${word}: ${e}`);
            }
        }
        return saved;
    }
    async updateSpacedRepetition(userId, wordId, correct) {
        const item = await this.prisma.vocabularyItem.findFirst({
            where: {
                id: wordId,
                userId
            }
        });
        if (!item) throw new _common.NotFoundException('Vocabulary item not found');
        const timesCorrect = item.timesCorrect + (correct ? 1 : 0);
        const timesWrong = item.timesWrong + (correct ? 0 : 1);
        const totalAttempts = timesCorrect + timesWrong;
        let status = item.status;
        if (totalAttempts >= 5 && timesCorrect / totalAttempts >= 0.8) {
            status = 'mastered';
        } else if (totalAttempts >= 3 && timesCorrect / totalAttempts >= 0.6) {
            status = 'reviewing';
        }
        const easeFactor = correct ? 2.5 : 0.5;
        const interval = Math.max(1, Math.floor(totalAttempts * easeFactor));
        const nextReview = this.calculateNextReview(new Date(), interval);
        return this.prisma.vocabularyItem.update({
            where: {
                id: wordId
            },
            data: {
                timesCorrect,
                timesWrong,
                status,
                lastReviewed: new Date(),
                nextReview
            }
        });
    }
    calculateNextReview(from, intervalDays) {
        const next = new Date(from);
        next.setDate(next.getDate() + intervalDays);
        return next;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(VocabularyService.name);
    }
};
VocabularyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], VocabularyService);

//# sourceMappingURL=vocabulary.service.js.map
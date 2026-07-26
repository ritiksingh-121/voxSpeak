"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationsService", {
    enumerable: true,
    get: function() {
        return NotificationsService;
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
let NotificationsService = class NotificationsService {
    async create(userId, type, title, body, data) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                body,
                data: data ?? {}
            }
        });
    }
    async list(userId, pagination) {
        const where = {
            userId
        };
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip: pagination.skip,
                take: pagination.limit
            }),
            this.prisma.notification.count({
                where
            })
        ]);
        return {
            data,
            meta: {
                total,
                page: pagination.page ?? 1,
                limit: pagination.limit ?? 20,
                totalPages: Math.ceil(total / (pagination.limit ?? 20))
            }
        };
    }
    async markAsRead(userId, notificationId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId
            }
        });
        if (!notification) throw new Error('Notification not found');
        return this.prisma.notification.update({
            where: {
                id: notificationId
            },
            data: {
                read: true
            }
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: {
                read: true
            }
        });
        return {
            message: 'All notifications marked as read'
        };
    }
    async deleteOldNotifications(daysOld = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);
        const result = await this.prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: cutoff
                }
            }
        });
        this.logger.log(`Deleted ${result.count} old notifications`);
        return result;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(NotificationsService.name);
    }
};
NotificationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], NotificationsService);

//# sourceMappingURL=notifications.service.js.map
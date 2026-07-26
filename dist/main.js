"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _appmodule = require("./app.module");
const _httpexceptionfilter = require("./common/filters/http-exception.filter");
const _transforminterceptor = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    const logger = new _common.Logger('Bootstrap');
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:3000'
        ],
        credentials: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.useGlobalFilters(new _httpexceptionfilter.HttpExceptionFilter());
    app.useGlobalInterceptors(new _transforminterceptor.TransformInterceptor());
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`VoxSpeak API running on port ${port}`);
}
bootstrap();

//# sourceMappingURL=main.js.map
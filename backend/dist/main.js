"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const middleware_1 = require("graphql-voyager/middleware");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.use('/schema', (0, middleware_1.express)({ endpointUrl: '/graphql' }));
    const configService = app.get(config_1.ConfigService);
    await app.listen(configService.get('server.port'), '::');
}
bootstrap();
//# sourceMappingURL=main.js.map
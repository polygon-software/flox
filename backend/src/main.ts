import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { ConfigService } from '@nestjs/config';
import {
  floxModuleOptions,
  getActiveFloxModuleNames,
} from './flox/core/flox-helpers';
import serverlessExpress from '@vendia/serverless-express';

/**
 * Bootstraps the nest application itself
 * @param {boolean} [serverless] - whether to run in serverless mode
 * @returns {Promise<serverlessExpress|NestApplication>} - application handler
 */
export async function bootstrap(serverless = false) {
  const app = await NestFactory.create(AppModule);
  await app.init();

  // Add GraphQL Voyager as middleware
  app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }));

  const configService: ConfigService = app.get(ConfigService);
  if (!serverless) {
    await app.listen(configService.get('server.port'));
  }
  const expressApp = app.getHttpAdapter().getInstance();

  // Return in serverless or non-serverless mode
  return serverless ? serverlessExpress({ app: expressApp }) : app;
}

// Start application
bootstrap().then(() => {
  console.log('Backend started successfully.');
  console.log('=======================');
  getActiveFloxModuleNames().forEach((moduleName) => {
    console.log(`Module '${moduleName}':`);
    console.log(`Options: ${JSON.stringify(floxModuleOptions(moduleName))}`);
    console.log('=======================');
  });
});

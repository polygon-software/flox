import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fmp = require('fastify-multipart');
import { AppModule } from './app.module';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { ConfigService } from '@nestjs/config';
import { floxModuleOptions, getActiveFloxModuleNames } from './flox/flox';

/**
 * Bootstraps the nest application itself
 * @returns {Promise<void>} - done
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Add GraphQL Voyager as middleware (intended for express, but seems to work on fastify as well)
  app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }));

  // IMPORTANT: make sure to copy voyager.worker.js from node_modules/graphql-voyager/dist
  // to the same folder as your main bundle or use workerURI property to specify other path.
  // Not sure if this is actually relevant
  const configService: ConfigService = app.get(ConfigService);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(fmp);
  await app.listen(configService.get('server.port'), '::');
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

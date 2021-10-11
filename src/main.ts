import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Add GraphQL Voyager as middleware (intended for express, but seems to work on fastify as well)
  app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }));

  await app.listen(3000);
}
bootstrap();

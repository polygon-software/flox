import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import serverlessExpress from '@vendia/serverless-express';
import { ENV, extractBoolEnvVar } from './env';

/**
 * Creates nest application based on GraphQL
 * @returns Nest Application
 */
async function createNestApp(): Promise<NestApplication> {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    cors: extractBoolEnvVar(ENV.DEV),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();

  // Add GraphQL Voyager as middleware
  app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }));

  // Collection of smaller middleware functions that set security-related HTTP headers
  app.use(helmet());
  return app;
}

/**
 * Returns Nest bootstrapped for serverside usage
 */
export async function bootstrapNest(): Promise<NestApplication> {
  const app = await createNestApp();
  const configService: ConfigService = app.get(ConfigService);
  const serverPort = configService.getOrThrow('server.port');
  if (serverPort == undefined) {
    throw new Error('Server port can not be undefined');
  }
  await app.listen(serverPort);
  return app;
}

/**
 * Returns nest bootstrapped for serverless usage
 */
export async function bootstrapServerless(): Promise<
  ReturnType<typeof serverlessExpress>
> {
  const app = await createNestApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

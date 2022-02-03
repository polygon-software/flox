import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fmp = require('fastify-multipart');
import { AppModule } from './app.module';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';

/**
 * Create NestFastifyApplication
 * @returns {Promise<void>} - Done
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        format: winston.format.uncolorize(), //Uncolorize logs as weird character encoding appears when logs are colorized in cloudwatch.
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
          new CloudWatchTransport({
            name: 'Cloudwatch Logs',
            logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
            logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY,
            awsSecretKey: process.env.AWS_KEY_SECRET,
            awsRegion: process.env.AWS_REGION,
            messageFormatter: function (item) {
              return (
                item.level +
                ': ' +
                item.message +
                ' ' +
                JSON.stringify(item.meta)
              );
            },
          }),
        ],
      }),
    },
  );

  // Add GraphQL Voyager as middleware (intended for express, but seems to work on fastify as well)
  app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }));
  // IMPORTANT: make sure to copy voyager.worker.js from node_modules/graphql-voyager/dist
  // to the same folder as your main bundle or use workerURI property to specify other path.
  // Not sure if this is actually relevant, TODO test
  const configService: ConfigService = app.get(ConfigService);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(fmp);
  await app.listen(configService.get('server.port'), '::');
}
bootstrap();

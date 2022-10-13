import { join } from 'path';

import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import * as Joi from 'joi';

import configuration from './config/configuration';
import { floxModules, floxProviders } from './flox/flox';
import { HealthcheckController } from './flox/modules/healthcheck/healthcheck.controller';
import { isServerless } from './flox/core/flox-helpers';
import { GqlThrottlerGuard } from './flox/modules/GqlThrottlerGuard';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      // In serverless mode, use in-memory schema
      autoSchemaFile: isServerless()
        ? true
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // Database
        DB_DATABASE: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),

        // Ports
        NOCODB_PORT: Joi.number().required(),
        SERVER_PORT: Joi.number().required(),
        DB_PORT: Joi.number().required(),

        // AWS
        AWS_MAIN_REGION: Joi.string().required(),
        // TODO: handle in separate PR, how do we want to handle keys?
        // AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
        // AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
        // AWS_SES_ACCESS_KEY_ID: Joi.string().required(),
        // AWS_SES_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [configService.get('entities')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    // Healthcheck modules
    TerminusModule,
    HttpModule,

    // Flox modules
    ...floxModules(),
    // Add any custom modules here
  ],
  controllers: [HealthcheckController],
  providers: [
    // Provider for throttler rate limiting
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    // Flox module Providers
    ...floxProviders(),
    // Add any other custom module providers here
  ],
})

/**
 * Main Module
 */
export class AppModule {}

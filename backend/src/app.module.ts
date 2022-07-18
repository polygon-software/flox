import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';
import { floxModules, floxProviders } from './flox/flox';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthcheckController } from './flox/modules/healthcheck/healthcheck.controller';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {isServerless} from "./flox/core/flox-helpers";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      // In serverless mode, use in-memory schema
      autoSchemaFile: isServerless() ? true : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
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
        AWS_REGION: Joi.string().required(),
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

    // Healthcheck modules
    TerminusModule,
    HttpModule,

    // Flox modules
    ...floxModules(),
    // Add any custom modules here
  ],
  controllers: [HealthcheckController],
  providers: [
    // Flox module Providers
    ...floxProviders(),
    // Add any other custom module providers here
  ],
})

/**
 * Main Module
 */
export class AppModule {}

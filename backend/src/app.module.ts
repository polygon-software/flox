import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
  AcceptLanguageResolver,
  CookieResolver,
  I18nModule,
} from 'nestjs-i18n';

import flox from '../flox.config.json';

import configuration from './config/configuration';
import { isServerless } from './flox/core/flox-helpers';
import { floxModules, floxProviders } from './flox/flox';
import GqlThrottlerGuard from './flox/modules/GqlThrottlerGuard';
import HealthcheckController from './flox/modules/healthcheck/healthcheck.controller';
import env from './env';
import FormModule from './modules/form/form.module';
import ImageFileModule from './modules/image-file/image-file.module';
import ArticleSuggestionModule from './modules/article-suggestion/article-suggestion.module';

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
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
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
        AWS_ADMIN_ACCESS_KEY_ID: Joi.string().required(),
        AWS_ADMIN_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.getOrThrow<string>('database.host'),
          port: configService.getOrThrow<number>('database.port'),
          username: configService.getOrThrow<string>('database.username'),
          password: configService.getOrThrow<string>('database.password'),
          database: configService.getOrThrow<string>('database.database'),
          entities: [configService.getOrThrow<string>('entities')],
          synchronize: env.DEV,
          logging: ['warn', 'error'],
        } as PostgresConnectionOptions),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
      ignoreUserAgents: [
        // Don't throttle request that have 'googlebot' defined in them.
        // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
        /googlebot/gi,

        // Don't throttle request that have 'bingbot' defined in them.
        // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
        /'bingbot'/gi,
      ],
    }),
    I18nModule.forRoot({
      fallbackLanguage: flox.i18n.defaultLocale,
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: env.DEV,
      },
      resolvers: [
        { use: CookieResolver, options: 'lang' },
        AcceptLanguageResolver,
      ],
    }),

    // Healthcheck modules
    TerminusModule,
    HttpModule,

    // Flox modules
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...(floxModules() as any[]),
    ArticleSuggestionModule,
    FormModule,
    ImageFileModule,
  ],
  controllers: [HealthcheckController],
  providers: [
    // Provider for throttler rate limiting
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    // Flox module Providers
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...floxProviders(),
    // Add any other custom module providers here
    ArticleSuggestionModule,
    FormModule,
    ImageFileModule,
  ],
})

/**
 * Main Module
 */
export default class AppModule {}

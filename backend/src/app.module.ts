import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Context } from 'vm';
import { JwtAuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';
import { ItemModule } from './item/item.module';
import * as Joi from 'joi';
import { FileModule } from './file/file.module';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      //services: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo Sandbox instead of graphql-playground
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      //disableHealthCheck: true //set true if using multiple GraphQL endpoints in a single application with fastify
      installSubscriptionHandlers: true,
      subscriptions: {
        // Could also use graphql-ws instead of default (subscriptions-transport-ws)
        'subscriptions-transport-ws': {
          path: '/graphql-websocket',
          onConnect: (context: Context) => {
            console.log('Client connected to GraphQL Websocket!', context);
          },
        },
      },
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
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
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
    UserModule,
    ItemModule,
    FileModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

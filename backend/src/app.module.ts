import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtAuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';
import * as Joi from 'joi';
import { RolesGuard } from './auth/roles.guard';
import { User } from './modules/user/entities/user.entity';
import { DeviceModule } from './modules/device/device.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      //services: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo Sandbox instead of graphql-playground
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      //disableHealthCheck: true //set true if using multiple GraphQL endpoints in a single application with fastify
      cors: false,
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
        DB_PORT: Joi.number().required(),

        // Server
        SERVER_PORT: Joi.number().required(),

        // Maria DB
        MR_PORT: Joi.number().required(),
        MR_2000: Joi.string().required(),
        MR_3000: Joi.string().required(),
        MR_USER: Joi.string().required(),
        MR_PASSWORD: Joi.string().required(),
        MR_HOST: Joi.string().required(),

        // Python API
        PY_PORT: Joi.number().required(),
        PY_HOST: Joi.string().required(),
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
    TypeOrmModule.forRootAsync({
      name: 'MR2000',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('mr2000.host'),
        port: configService.get('mr2000.port'),
        username: configService.get('mr2000.username'),
        password: configService.get('mr2000.password'),
        database: configService.get('mr2000.database'),
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'MR3000',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('mr3000.host'),
        port: configService.get('mr3000.port'),
        username: configService.get('mr3000.username'),
        password: configService.get('mr3000.password'),
        database: configService.get('mr3000.database'),
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    DeviceModule,
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

/**
 * Main Module
 */
export class AppModule {}

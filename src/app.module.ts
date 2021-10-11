import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      //plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use Apollo Sandbox instead of graphql-playground
      debug: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // Auto-generates typescript definitions with AST changes
        outputAs: 'class', // Alternative: 'interface'
      },
      //disableHealthCheck: true //set true if using multiple GraphQL endpoints in a single application with fastify
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

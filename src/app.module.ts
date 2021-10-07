import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true, // TODO config stuff goes here
      debug: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // Auto-generates typescript definitions with AST changes
        outputAs: 'interface', // Alternative: 'class
      },
      //disableHealthCheck: true //set true if using multiple GraphQL endpoints in a single application with fastify
    }),
    UserModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

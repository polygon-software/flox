/*
 * Generate GraphQL schema manually. NestJS does not generate the GraphQL schema
 * automatically during the build process, and it doesn't generate the GraphQL
 * schema when starting the built app. This schema needs to be generated or
 * the GraphQL api would have nothing to use.
 *
 * @returns {Promise<void>} Nothing gets returned. It will just write the schema and
 * throw an error if it fails.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { printSchema } from 'graphql/utilities';

import 'multer';

import AccessControlResolver from '../flox/modules/access-control/access-control.resolver';
import AbstractCrudResolver from '../flox/modules/abstracts/crud/abstract-crud.resolver';
import AbstractCrudAccessControlResolver from '../flox/modules/abstracts/crud-access-control/abstract-crud-access-control.resolver';
import AbstractSearchResolver from '../flox/modules/abstracts/search/abstract-search.resolver';
import AbstractSearchAccessControlResolver from '../flox/modules/abstracts/search-access-control/abstract-search-access-control.resolver';
import FileResolver from '../flox/modules/file/file.resolver';
import FormResolver from '../modules/form/form.resolver';
import ImageResolver from '../flox/modules/image/image.resolver';
import NotificationResolver from '../flox/modules/notifications/notification.resolver';
import PaymentResolver from '../flox/modules/payment/payment.resolver';
import UserResolver from '../flox/modules/auth/user.resolver';

/**
 * Generates schema.gql without starting the application.
 * All resolvers must be listed below!
 * Absolut imports are not possible within the modules!
 *
 * @returns {Promise<void>} - done
 */
async function generateGraphQLSchema(): Promise<void> {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();
  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([
    AbstractCrudResolver,
    AbstractCrudAccessControlResolver,
    AbstractSearchResolver,
    AbstractSearchAccessControlResolver,
    AccessControlResolver,
    FileResolver,
    FormResolver,
    ImageResolver,
    NotificationResolver,
    PaymentResolver,
    UserResolver,
  ]);
  writeFileSync(join(process.cwd(), 'schema.gql'), printSchema(schema));
}
void generateGraphQLSchema();

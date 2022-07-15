import awsLambdaFastify from '@fastify/aws-lambda';
import { bootstrap } from './main';
import { FastifyInstance } from 'fastify';

// interface NestApp {
//   app: NestFastifyApplication;
//   instance: FastifyInstance;
// }
//
// let cachedNestApp: NestApp;

// /**
//  * Bootstraps for Lambda deployment
//  * @returns {Promise<NestApp>} - bootstrapped Nest application
//  */
// async function bootstrapServer(): Promise<NestApp> {
//   const serverOptions: FastifyServerOptions = { logger: true };
//   const instance: FastifyInstance = fastify(serverOptions);
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter(instance),
//     { logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console },
//   );
//   await app.init();
//   return { app, instance };
// }

export const handler = async (): Promise<unknown> => {
  const app = await bootstrap();
  return awsLambdaFastify(app as unknown as FastifyInstance);
};

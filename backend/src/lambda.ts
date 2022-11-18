import { Callback, Context, Handler } from 'aws-lambda';

import { bootstrapServerless } from './bootstrap';

/**
 * Bootstraps for Lambda deployment
 *
 * @param event - trigger event
 * @param context - execution context
 * @param callback - callback
 * @returns bootstrapped Nest application
 */
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const server = await bootstrapServerless();
  return server(event, context, callback);
};

export default handler;

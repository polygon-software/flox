import { Handler, Context, Callback } from 'aws-lambda';
import { bootstrapServerless } from './bootstrap';

/**
 * Bootstraps for Lambda deployment
 * @param {any} event - trigger event
 * @param {Context} context - execution context
 * @param {Callback} callback - callback
 * @returns {Promise<unknown>} - bootstrapped Nest application
 */
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const server = await bootstrapServerless();
  return server(event, context, callback);
};

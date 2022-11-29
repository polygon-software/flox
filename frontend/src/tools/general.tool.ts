/**
 * This file contains all generalized helper functions that don't fit in anywhere else
 */

/**
 * Waits for a given time
 *
 * @param milliseconds - time to wait in ms (defaults to 100)
 */
// eslint-disable-next-line import/prefer-default-export
export async function sleep(milliseconds = 100): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

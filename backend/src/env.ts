/**
 * Extract environment variable as string from environment
 * @param key - process env key
 * @returns environment variable as string
 */
export function extractStringEnvVar(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];

  if (value === undefined) {
    const message = `The environment variable "${key}" cannot be "undefined".`;

    throw new Error(message);
  }

  return value;
}

/**
 * Extract environment variable as integer from environment
 * @param key - process env key
 * @returns environment variable as integer
 */
export function extractNumberEnvVar(key: keyof NodeJS.ProcessEnv): number {
  const stringValue = extractStringEnvVar(key);

  const numberValue = parseFloat(stringValue);

  if (Number.isNaN(numberValue)) {
    const message = `The environment variable "${key}" has to hold a stringified number value - not ${stringValue}`;

    throw new Error(message);
  }

  return numberValue;
}

/**
 * Extract environment variable as boolean from environment
 * @param key - process env key
 * @returns environment variable as boolean
 */
export function extractBoolEnvVar(key: keyof NodeJS.ProcessEnv): boolean {
  return extractStringEnvVar(key) === 'true';
}

export enum ENV {
  SERVER_PORT = 'SERVER_PORT',
  ENTITIES = 'ENTITIES',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  AWS_MAIN_REGION = 'AWS_MAIN_REGION',
  DEV = 'DEV',
}

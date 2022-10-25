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
  const strVar = extractStringEnvVar(key);
  if (!(strVar === 'true' || strVar === 'false')) {
    const message = `The environment variable "${key}" has to hold a stringified boolean value - not ${strVar}`;
    throw new Error(message);
  }
  return strVar === 'true';
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_APP_NAME: string;
    VUE_APP_AWS_REGION: string;
    SERVICE_WORKER_FILE: string;
    VUE_APP_BACKEND_URL: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_APP_PRODUCTION: 'true' | 'false';
    VUE_APP_USER_POOL_ID: string;
    VUE_APP_USER_POOL_CLIENT_ID: string;
    MODE: string;
    DEV: 'true' | 'false';
    SERVER: 'true' | 'false';
    CLIENT: 'true' | 'false';
    VUE_APP_GRAPHQL_ENDPOINT: string;
    VUE_ROUTER_BASE: string;
  }
}

export enum ENV {
  VUE_APP_NAME = 'VUE_APP_NAME',
  VUE_APP_GRAPHQL_ENDPOINT = 'VUE_APP_GRAPHQL_ENDPOINT',
  VUE_APP_AWS_REGION = 'VUE_APP_AWS_REGION',
  SERVICE_WORKER_FILE = 'SERVICE_WORKER_FILE',
  VUE_APP_BACKEND_URL = 'VUE_APP_BACKEND_URL',
  VUE_ROUTER_MODE = 'VUE_ROUTER_MODE',
  VUE_APP_PRODUCTION = 'VUE_APP_PRODUCTION',
  VUE_APP_USER_POOL_ID = 'VUE_APP_USER_POOL_ID',
  VUE_APP_USER_POOL_CLIENT_ID = 'VUE_APP_USER_POOL_CLIENT_ID',
  MODE = 'MODE',
  DEV = 'DEV',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  VUE_ROUTER_BASE = 'VUE_ROUTER_BASE',
}

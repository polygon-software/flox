/**
 * Ensures extracted environment variable is a string
 *
 * @param value - extracted environment variable
 * @returns environment variable as string
 */
function asString(value: string | undefined): string {
  if (value === undefined) {
    const message = 'The environment variable cannot be "undefined".';
    throw new Error(message);
  }

  return `${value}`;
}

/**
 * Ensures extracted environment variable is a number
 *
 * @param value - extracted environment variable
 * @returns environment variable as integer
 */
function asNumber(value: string | undefined): number {
  const stringValue = asString(value);
  const numberValue = parseFloat(stringValue);

  if (Number.isNaN(numberValue)) {
    const message = `The environment variable has to hold a stringified number value - not ${stringValue}`;
    throw new Error(message);
  }

  return numberValue;
}

/**
 * Ensures extracted environment variable is a boolean
 *
 * @param value - extracted environment variable
 * @returns environment variable as boolean
 */
function asBoolean(value: string | undefined): boolean {
  const strVar = asString(value);
  if (!(strVar === 'true' || strVar === 'false')) {
    const message = `The environment variable has to hold a stringified boolean value - not ${strVar}`;
    throw new Error(message);
  }
  return strVar === 'true';
}

export default {
  /**
   * @returns Region in which AWS services are hosted, especially cognito
   */
  get AWS_MAIN_REGION(): string {
    return asString(process.env.AWS_MAIN_REGION);
  },
  /**
   * @returns database name
   */
  get DB_DATABASE(): string {
    return asString(process.env.DB_DATABASE);
  },
  /**
   * @returns database admin user
   */
  get DB_USER(): string {
    return asString(process.env.DB_USER);
  },
  /**
   * @returns database admin password
   */
  get DB_PASSWORD(): string {
    return asString(process.env.DB_PASSWORD);
  },
  /**
   * @returns database port
   */
  get DB_PORT(): number {
    return asNumber(process.env.DB_PORT);
  },
  /**
   * @returns database host name
   * @example database
   */
  get DB_HOST(): string {
    return asString(process.env.DB_HOST);
  },
  /**
   * @returns cognito user pool ID
   */
  get USER_POOL_ID(): string {
    return asString(process.env.USER_POOL_ID);
  },
  /**
   * @returns cognito user pool ID
   */
  get USER_POOL_CLIENT_ID(): string {
    return asString(process.env.USER_POOL_CLIENT_ID);
  },
  /**
   * @returns glob describing where typeorm entities are found
   * @example dist/entities/*.entity.js
   */
  get ENTITIES(): string {
    return asString(process.env.ENTITIES);
  },
  /**
   * @returns backend port for lambda functions
   */
  get SERVER_PORT(): number {
    return asNumber(process.env.SERVER_PORT);
  },
  /**
   * @returns whether application runs on a lambda function
   */
  get SERVERLESS(): boolean {
    return asBoolean(process.env.SERVERLESS);
  },
  /**
   * @returns whether application runs in development mode
   */
  get DEV(): boolean {
    return asBoolean(process.env.DEV);
  },
  /**
   * @returns base url of frontend
   */
  get BASE_URL(): string {
    return asString(process.env.BASE_URL);
  },

  /**
   * @returns name of project
   */
  get PROJECT_NAME(): string {
    return asString(process.env.PROJECT_NAME);
  },
  /**
   * @returns stripe secret key used to create payment intents
   */
  get STRIPE_SECRET_KEY(): string {
    return asString(process.env.STRIPE_SECRET_KEY);
  },
  /**
   * @returns AWS admin access key ID
   */
  get AWS_ADMIN_ACCESS_KEY_ID(): string {
    return asString(process.env.AWS_ADMIN_ACCESS_KEY_ID);
  },
  /**
   * @returns AWS admin secret access key
   */
  get AWS_ADMIN_SECRET_ACCESS_KEY(): string {
    return asString(process.env.AWS_ADMIN_SECRET_ACCESS_KEY);
  },
};

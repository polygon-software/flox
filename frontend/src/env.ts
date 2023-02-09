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
// eslint-disable-next-line no-unused-vars,no-unused-vars,@typescript-eslint/no-unused-vars
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

/**
 * Ensures extracted environment variable is one of the provided values
 *
 * @param value - extracted environment variable
 * @param valueList - list of possible values
 * @returns environment variable
 */
function asOneOf<T extends string | number>(value: T, valueList: T[]): T {
  if (!valueList.includes(value)) {
    const message = `The environment variable must be one of the following: ${valueList.join(
      ','
    )} - not ${value}`;
    throw new Error(message);
  }
  return value;
}

export default {
  /**
   * @returns Vue App Name
   * @example flox-test
   */
  get VUE_APP_NAME(): string {
    return asString(process.env.VUE_APP_NAME);
  },
  /**
   * @returns Url of graphql backend endpoint
   * @example http://localhost:3000/graphql
   */
  get VUE_APP_GRAPHQL_ENDPOINT(): string {
    return asString(process.env.VUE_APP_GRAPHQL_ENDPOINT);
  },
  /**
   * @returns Region in which AWS services are hosted, especially cognito
   */
  get VUE_APP_AWS_REGION(): string {
    return asString(process.env.VUE_APP_AWS_REGION);
  },
  /**
   * @returns Url of backend (without graphql)
   * @example http://localhost:3000
   */
  get VUE_APP_BACKEND_URL(): string {
    return asString(process.env.VUE_APP_BACKEND_URL);
  },
  /**
   * @returns whether this build is a production build
   */
  get VUE_APP_PRODUCTION(): boolean {
    return asBoolean(process.env.VUE_APP_PRODUCTION);
  },
  /**
   * @returns cognito user pool ID
   */
  get VUE_APP_USER_POOL_ID(): string {
    return asString(process.env.VUE_APP_USER_POOL_ID);
  },
  /**
   * @returns cognito user pool ID
   */
  get VUE_APP_USER_POOL_CLIENT_ID(): string {
    return asString(process.env.VUE_APP_USER_POOL_CLIENT_ID);
  },
  /**
   * @returns quasar mode: dev, spa, pwa, ssr etc.
   */
  get MODE():
    | 'spa'
    | 'pwa'
    | 'ssr'
    | 'bex'
    | 'cordova'
    | 'capacitor'
    | 'electron' {
    return asOneOf<string>(asString(process.env.MODE), [
      'spa',
      'pwa',
      'ssr',
      'bex',
      'cordova',
      'capacitor',
      'electron',
    ]) as unknown as
      | 'pwa'
      | 'ssr'
      | 'bex'
      | 'cordova'
      | 'capacitor'
      | 'electron';
  },
  /**
   * @returns node mode: production, development
   */
  get NODE_ENV(): 'production' | 'development' {
    return asOneOf<string>(asString(process.env.NODE_ENV), [
      'production',
      'development',
    ]) as unknown as 'production' | 'development';
  },
  /**
   * @returns whether application is in DEV mode
   */
  get DEV(): boolean {
    return asBoolean(process.env.DEV);
  },
  /**
   * @returns whether application is in PROD mode
   */
  get PROD(): boolean {
    return asBoolean(process.env.PROD);
  },
  /**
   * @returns whether application is in DEBUGGING mode
   */
  get DEBUGGING(): boolean {
    return asBoolean(process.env.DEBUGGING);
  },
  /**
   * @returns whether application runs on client
   */
  get CLIENT(): boolean {
    return asBoolean(process.env.CLIENT);
  },
  /**
   * @returns whether application runs on server
   */
  get SERVER(): boolean {
    return asBoolean(process.env.SERVER);
  },
  /**
   * @returns stripe public key used to accept payment intents
   */
  get STRIPE_PUBLIC_KEY(): string {
    return asString(process.env.STRIPE_PUBLIC_KEY);
  },
};

import { ENV, extractNumberEnvVar, extractStringEnvVar } from '../env';

export default (): Config => ({
  server: {
    port: extractNumberEnvVar(ENV.SERVER_PORT) || 3000,
  },
  entities: extractStringEnvVar(ENV.ENTITIES),
  database: {
    host: extractStringEnvVar(ENV.DB_HOST),
    port: extractStringEnvVar(ENV.DB_PORT),
    username: extractStringEnvVar(ENV.DB_USER),
    password: extractStringEnvVar(ENV.DB_PASSWORD),
    database: extractStringEnvVar(ENV.DB_DATABASE),
  },
});

export class ServerConfig {
  port: number | undefined;
}

export class DatabaseConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export class Config {
  server: ServerConfig;
  entities: string;
  database: DatabaseConfig;
}

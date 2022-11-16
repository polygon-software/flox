import Env from '../env';

export default (): Config => ({
  server: {
    port: Env.SERVER_PORT || 3000,
  },
  entities: Env.ENTITIES,
  database: {
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    username: Env.DB_USER,
    password: Env.DB_PASSWORD,
    database: Env.DB_DATABASE,
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

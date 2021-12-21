export default (): Config => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
  entities: process.env.ENTITIES,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

export class serverConfig {
  port: number;
}

export class databaseConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export class Config {
  server: serverConfig;
  entities: string;
  database: databaseConfig;
}

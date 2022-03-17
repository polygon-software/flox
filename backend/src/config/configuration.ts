export default (): Config => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
  entities: process.env.ENTITIES,
  database: {
    host: process.env.MR_HOST,
    port: process.env.MR_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  mr2000: {
    host: process.env.MR_HOST,
    port: process.env.MR_PORT,
    username: process.env.MR_USER,
    password: process.env.MR_PASSWORD,
    database: process.env.MR_2000,
  },
  mr3000: {
    host: process.env.MR_HOST,
    port: process.env.MR_PORT,
    username: process.env.MR_USER,
    password: process.env.MR_PASSWORD,
    database: process.env.MR_3000,
  },
  openvpn: {
    host: process.env.MR_HOST,
    port: process.env.MR_PORT,
    username: process.env.MR_USER,
    password: process.env.MR_PASSWORD,
    database: process.env.OPENVPN,
  },
  pyAPI: {
    host: process.env.PY_HOST,
    port: process.env.PY_PORT,
  },
});

type ServerConfig = {
  port: number;
};

type APIConfig = {
  host: string;
  port: string;
};

type DatabaseConfig = {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
};

type Config = {
  server: ServerConfig;
  entities: string;
  database: DatabaseConfig;
  mr2000: DatabaseConfig;
  mr3000: DatabaseConfig;
  openvpn: DatabaseConfig;
  pyAPI: APIConfig;
};

import { config } from 'dotenv';
config();

type EnvConfig = {
  MONGO_DB?: string;
  ORIGIN?: string;
  PORT?: string;
  SECRET_KEY?: string;
  ACTUAL_ENVIRONMENT?: string;
  ACCESS_TOKEN_MP?: string;
};
const ENV: EnvConfig = {
  ACCESS_TOKEN_MP: process.env.ACCESS_TOKEN_MP,
  ACTUAL_ENVIRONMENT: process.env.ACTUAL_ENVIRONMENT,
  MONGO_DB: process.env.MONGO,
  ORIGIN: process.env.ORIGIN,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
};

export default ENV;

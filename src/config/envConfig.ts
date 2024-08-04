import { config } from 'dotenv';
config();

type EnvConfig = {
  MONGO_DB?: string;
  ORIGIN?: string;
  PORT?: string;
  SECRET_KEY?: string;
};
const ENV: EnvConfig = {
  MONGO_DB: process.env.MONGO,
  ORIGIN: process.env.ORIGIN,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
};

export default ENV;

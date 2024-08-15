import express, { Application } from 'express';
import ENV from '../config/envConfig';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';

const corsConfig = cors({
  allowedHeaders: 'Content-Type',
  exposedHeaders: 'Content-Type',
  origin: ENV.ORIGIN,
});
const sessionConfig = session({
  cookie: { secure: ENV.ACTUAL_ENVIRONMENT === 'prod' ? true : false }, // true for HTTPS
  resave: true,
  saveUninitialized: true,
  secret: ENV.SECRET_KEY ?? '1234',
});

export default function middlewares(app: Application) {
  app.use(corsConfig);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(sessionConfig);
}

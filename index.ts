import 'reflect-metadata';
import express, { Application } from 'express';
import ENV from './src/config/envConfig';
import dictionary from './src/config/dictionary';
import errorHandler from './src/helpers/errorHandler';
import middlewares from './src/middlewares/middlewares';
import orders from './src/application/orders/orderRoutes';
import products from './src/application/products/productRoutes';
import server from './src/config/dbConfig';
import user from './src/application/users/userRoutes';

// config
const app: Application = express();

middlewares(app);

// endpoints
app.use('/api/v1/products', products);
app.use('/api/v1/orders', orders);
app.use('/api/v1/user', user);

app.use(errorHandler);

app.listen(ENV.PORT, () => {
  if (ENV.PORT) {
    server();
    console.log(`${dictionary.serverOn}${ENV.PORT}`);
  } else {
    console.log(`${dictionary.serverOn}+3000`);
  }
});

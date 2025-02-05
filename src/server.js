/* eslint-disable no-console */
import express from 'express';
import cros from 'cors';
import exitHook from 'async-exit-hook';
import { env } from '~/config/environment';
import { corsOptions } from './config/cors';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { APIs_V1 } from '~/routes/v1';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';

const START_SERVER = () => {
  const app = express();
  app.use(cros(corsOptions));

  app.use(express.json());

  app.use('/v1', APIs_V1);

  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Server running at production http://${process.env.PORT}`);
    });
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Server running at http://${env.APP_HOST}:${env.APP_PORT}/`);
    });
  }


  exitHook(() => {
    console.log('Closing MongoDB connection...');
    CLOSE_DB();
    console.log('MongoDB connection closed');
  });
};

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await CONNECT_DB();
    console.log('Connected to MongoDB');

    START_SERVER();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(0);
  }
})();

// CONNECT_DB()
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(0);
//   });

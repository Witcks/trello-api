/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { env } from '~/config/environment';

import { MongoClient, ServerApiVersion } from 'mongodb';

let trelloDatabaseInstancce = null;

const MongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await MongoClientInstance.connect();
  trelloDatabaseInstancce = MongoClientInstance.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!trelloDatabaseInstancce) throw new Error('Database is not connected');
  return trelloDatabaseInstancce;
};

export const CLOSE_DB = async () => {
  await MongoClientInstance.close();
};

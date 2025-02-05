/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardRoute } from '~/routes/v1/boardRoute';
import { columnRoute } from '~/routes/v1/columnRoute';
import { cardRoute } from '~/routes/v1/cardRoute';

const Router = express.Router();

Router.get('/status', async (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 are ready!',
  });
});

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);

export const APIs_V1 = Router;

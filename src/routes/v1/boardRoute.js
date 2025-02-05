
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardController } from '~/controllers/boardController';
import { boardValidation } from '~/validations/boardValidation';

const Router = express.Router();

Router.route('/')
  .get(async (req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get list of boards',
    });
  })
  .post(boardValidation.createNew, boardController.createNew);

Router.route('/:id').get(boardController.getDetails).put(
  boardValidation.update,
  boardController.update,
);

Router.route('/supports/moving_card').put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn,
);

export const boardRoute = Router;

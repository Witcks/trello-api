/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { cloneDeep } from 'lodash';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    const createdBoard = await boardModel.createNew(newBoard);

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // console.log(getNewBoard);

    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
    }

    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString());
    })

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: new Date(),
    }
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOderIds,
      updatedAt: new Date(),
    });
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: new Date(),
    });

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    })

    return { updatResult: 'success' };
  } catch (error) {
    throw error;
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
};

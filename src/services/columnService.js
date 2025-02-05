/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';
// import { slugify } from '~/utils/formatters';
// import ApiError from '~/utils/ApiError';
// import { StatusCodes } from 'http-status-codes';
// import { cloneDeep } from 'lodash';

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };

    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);
    // console.log(getNewColumn);

    if (getNewColumn) {
      getNewColumn.cards = [];
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: new Date(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  try {
    const taggetColumn = await columnModel.findOneById(columnId);

    if (!taggetColumn) {
      throw new Error('Column not found!');
    }

    await columnModel.deleteOneById(columnId);

    await cardModel.deleteManyByColumnId(columnId);

    await boardModel.pullColumnOrderIds(taggetColumn);

    return { deleteResult: 'Column and its Cards deleted successfully!' };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem
};

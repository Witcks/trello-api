/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
// import { slugify } from '~/utils/formatters';
// import ApiError from '~/utils/ApiError';
// import { StatusCodes } from 'http-status-codes';
// import { cloneDeep } from 'lodash';

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    };

    const createdCard = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneById(createdCard.insertedId);
    // console.log(getNewCard);

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
  } catch (error) {
    throw error;
  }
};


export const cardService = {
  createNew,
};

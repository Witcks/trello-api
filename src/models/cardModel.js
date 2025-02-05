import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards';
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];


const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newCardToAdd = {
      ...valiData,
      boardId: new ObjectId(valiData.boardId),
      columnId: new ObjectId(valiData.columnId),
    };


    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (carcId, updateData) => {
  try {
    Object.keys(updateData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete updateData[field];
      }
    })

    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId);
    }

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(carcId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
};

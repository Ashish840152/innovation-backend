const { model } = require("mongoose");
const { statusCode } = require("../Constant/constant.js");
const { generateError } = require("../Utils/utils");

const findOne = async (model, query) => {
    try {
        const data = await model.findOne(query);
        return data;
    } catch (err) {
        throw new Error(err);
    }
}

const saveData = async (model, data) => {
    try {
        return await new model(data).save();
    } catch (err) {
        throw await generateError(err.message, statusCode['Bad Request']);
    }
}

const findOneAndUpdate = async (model, findquery, updatequery) => {
    return await model.findOneAndUpdate(findquery, updatequery, { new: true });
}

const findAll = async (model,query) => {
    try {
        return await model.find(query);
    } catch (err) {
        throw await generateError(err.message, statusCode['Bad Request']);
    }
}



const findByQuery = async (model, findQuery) => {
    try {
        return await model.find(findQuery);
    } catch (err) {
        throw await generateError(err.message, statusCode['Bad Request']);
    }
}

const updateById = async (model, id, updatequery) => {
    try {
        return await model.findByIdAndUpdate(id, updatequery, { new: true });
    } catch (err) {
        throw await generateError(err.message, statusCode['Internal Server Error']);
    }
}

const findID = async (model, id) => {
    try {
        return await model.findById(id);
    } catch (err) {
        throw await generateError(err.message, statusCode['Internal Server Error']);
    }
}

const deleteID = async (model, id) => {
    try {
        return await model.findByIdAndDelete(id);
    } catch (err) {
        throw await generateError(err.message, statusCode['Internal Server Error']);
    }
}

const populateQuery = async (model, findQuery, populateQuery) => {
    try {
        return await model.find(findQuery).populate(populateQuery);
    } catch (err) {
        throw await generateError(err.message, statusCode['Internal Server Error']);
    }
}

const findByIdAndUpdate = async (model, id, data) => {
    try {
        return await model.findByIdAndUpdate(id,data);
    } catch (err) {
        throw await generateError(err.message, statusCode['Internal Server Error']);
    }
}

module.exports = {
    findOne,
    saveData,
    findOneAndUpdate,
    findAll,
    updateById,
    findByQuery,
    findID,
    populateQuery,
    deleteID,
    findByIdAndUpdate
}
const BookModel = require('../models/Book.js');
const wrr = require('./../funcs/writeFunc.js');




const getAll = async (req,res) => {
    const books = await BookModel.getAll()

    wrr(res,200,{"Content-Type":"application/json"},JSON.stringify(books))
}

const getOne = async (req,res,id) => {
    const bookInfo = await BookModel.getOne(id)
    wrr(res,201,{"Content-Type":"application/json"},JSON.stringify(bookInfo))
}

module.exports = {
    getAll,
    getOne
}
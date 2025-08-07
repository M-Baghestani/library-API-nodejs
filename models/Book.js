const fs = require('fs');
const db = require('../db.json');

const getAll = () => {

    return new Promise((resolve,reject) => {
        resolve(db.books)
    })
}

const getOne = (id) => {
    return new Promise((resolve,reject) => {
        const bookInfo = db.books.filter(book => book.id == id)
        resolve(bookInfo)
    })
}

module.exports = {
    getAll,
    getOne,
}
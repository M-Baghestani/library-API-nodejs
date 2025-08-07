const fs = require('fs');
const db = require('../db.json');

const get = () => {
    return new Promise((resolve,reject) => {
        resolve(db.users)
    })
}

const getOne = (id) => {
    return new Promise((resolve,reject) => {
        const userInfo = db.users.filter(user => user.id == id)
        resolve(userInfo)
    })
}

module.exports = {
    get,
    getOne
}
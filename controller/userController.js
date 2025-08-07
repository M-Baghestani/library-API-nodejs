const wrr = require('../funcs/writeFunc');
const userModel = require('./../models/User');

const getAll = async (req,res) => {
    const users = await userModel.get()

    wrr(res,200,{"Content-Type":"application/json"},JSON.stringify(users))
}


const getOne = async(req,res,id) => {
    const userInfo = await userModel.getOne(id)
    wrr(res,201,{"Content-Type":"application/json"},JSON.stringify(userInfo))
}




module.exports = {
    getAll,
    getOne
}
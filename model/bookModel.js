const mongoose = require('mongoose');

const {Schema} = mongoose;

const bookModel = new Schema(
    {
    author:{type:String},
    title: {type:String},
    }
);

module.exports = mongoose.model('Book', bookModel);
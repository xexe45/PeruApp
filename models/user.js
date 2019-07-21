let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let userSchema = new Schema({

    name: { type: String, required: [ true, 'Name is required' ] },
    email: { type: String, unique: true, required: [ true, 'Email is required' ] },
    password: { type: String, required: [ true, 'Password is required' ] },
    img: { type: String, required: false },

});

userSchema.plugin( uniqueValidator, { message: '{PATH} must be unique' } );

module.exports = mongoose.model('User', userSchema);
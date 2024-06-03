const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    phone: {type: String, unique: true, required: true},
    password: {type: String, required: true},
})

module.exports = model('User', UserSchema);
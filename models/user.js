const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    checkList: [{
        bookchecked: {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        },
        startDate: {
            type: Date,
            required: true
        },
        numberOfDays: {
            type: Number,
            required: true
        }
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
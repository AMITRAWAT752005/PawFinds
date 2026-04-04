const mongoose = require('mongoose')
const schema = mongoose.Schema;

const AdoptFormSchema = new schema({
    email: {
        type: String,
        required: true
    },
    livingSituation: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    previousExperience: {
        type: String,
        required: true
    },
    familyComposition: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('AdoptForm', AdoptFormSchema);
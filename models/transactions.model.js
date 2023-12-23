const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    from_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    to_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    to_phoneNumber: {
        required: true,
        type: String
    },
    from_phoneNumber: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    snd_BankBalance: {
        required: true,
        type: Number
    },
    rec_BankBalance: {
        required: true,
        type: Number
    }
},{
    timestamps: true
})

const Transaction = mongoose.model("Transaction",transactionSchema)

module.exports = Transaction
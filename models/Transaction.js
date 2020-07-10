const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['W', 'D']
        // W = Withdraw
        // D = Deposit
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    balanceAfterTransaction: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions')
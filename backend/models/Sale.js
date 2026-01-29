const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            qty: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', SaleSchema);
const mongoose = require('mongoose');

// Ye batata hai ke ek Product mein kya kya hona chahiye
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true    // Naam ke bagair product save nahi hoga
    },
    price: {
        type: Number,
        required: true    // Qeemat ke bagair product save nahi hoga
    },
    category: {
        type: String,
        default: "General" // Agar category nahi di, toh 'General' likha ayega
    },
    stock: {
        type: Number,
        default: 0         // Shuru mein stock 0 hoga
    }
});

// Is model ka naam hum 'Product' rakh rahe hain
module.exports = mongoose.model('Product', ProductSchema);
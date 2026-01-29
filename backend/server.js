const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected!");
    } catch (err) {
        console.error("❌ Connection Error: ", err);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

app.get('/', (req, res) => {
    res.send("Shopmate API is running on Vercel!");
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready on port ${PORT}`);
    });
}
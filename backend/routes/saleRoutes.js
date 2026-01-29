const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');


router.post('/add', async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const newSale = new Sale({ items, totalAmount });
        await newSale.save();
        res.status(201).json({ message: "Sale recorded!" });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/today_detailed', async (req, res) => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);


        const sales = await Sale.find({ 
            date: { $gte: start, $lte: end } 
        });

        const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
        
        res.json({ totalRevenue, sales });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

module.exports = router;
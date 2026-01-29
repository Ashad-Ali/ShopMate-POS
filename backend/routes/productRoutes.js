const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 


router.post('/add', async (req, res) => {
    try {
        const newProduct = new Product(req.body); 
        await newProduct.save(); 
        res.status(201).json({ message: "Product added Successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Can't add Product: " + err.message });
    }
});


router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Removed Successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
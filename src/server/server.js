const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stock = require('./models/Stock'); // MongoDB schema model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auto_repair_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks' });
  }
});

app.post('/api/stocks', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: 'Error adding stock' });
  }
});

app.put('/api/stocks/:id', async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: 'Error updating stock' });
  }
});

app.delete('/api/stocks/:id', async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting stock' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

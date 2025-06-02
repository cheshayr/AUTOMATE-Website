const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auto-repair', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ================== USER SCHEMA ==================
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  suffix: { type: String },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  role: { type: String, default: 'staff' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ================== STOCK SCHEMA ==================
const stockSchema = new mongoose.Schema({
  ID: String,
  customerName: String,
  contactNo: String,
  status: String,
  mechanic: String
});

const Stock = mongoose.model('Stock', stockSchema);

// ================== ROUTES ================== //

// --- User Login Route ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Simple password match (for demo purposes only — use bcrypt in production)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate dummy token (replace with JWT if needed later)
    const token = 'dummy-token';

    res.status(200).json({
      user: {
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// --- Stock Routes ---
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
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
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



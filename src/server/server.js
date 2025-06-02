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

// User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  prefix: { type: String },
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

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = 'dummy-token'; // Placeholder for JWT token

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

// Stock schema and routes
const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Stock = mongoose.model('Stock', stockSchema);

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

// Appointment schema and routes
const appointmentSchema = new mongoose.Schema({
  client: String,
  contact: String,
  vehicle: String,
  plateNumber: String,
  status: {
    type: String,
    enum: ['Pending Visit', 'Ongoing Repair', 'Billing', 'Completed', 'Cancelled'],
    default: 'Pending Visit',
  },
  trackingStep: {
    type: Number,
    default: 0,
  },
  mechanics: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Existing get appointment by id route
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Mobile tracking API route
app.get('/api/mobile/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Return only the fields needed for TrackingProgress screen
    res.json({
      trackingStep: appointment.trackingStep,
      plateNumber: appointment.plateNumber,
      vehicle: appointment.vehicle,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { status, trackingStep } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, trackingStep },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Website backend running on http://localhost:${PORT}`);
});





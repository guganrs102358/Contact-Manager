const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contactmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phones: [String], // Updated to handle multiple phone numbers
});

const Contact = mongoose.model('Contact', contactSchema);

// User Schema and Model (for Registration Details)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String, // Added password field for registration
});

const User = mongoose.model('User', userSchema);

// CRUD operations for Contacts
app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post('/contacts', async (req, res) => {
  const { name, email, phones } = req.body;
  const newContact = new Contact({ name, email, phones });
  await newContact.save();
  res.json(newContact);
});

app.put('/contacts/:id', async (req, res) => {
  const { name, email, phones } = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    { name, email, phones },
    { new: true }
  );
  res.json(updatedContact);
});

app.delete('/contacts/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Contact deleted' });
});

// Route to Handle User Registration
app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // Create a new user instance
  const newUser = new User({ name, email, phone, password });
  
  // Save the user to the database
  await newUser.save();
  
  res.status(200).json({ message: 'User registered successfully', user: newUser });
});

// Route to Handle User Login (optional)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find the user by email and password
  const user = await User.findOne({ email, password });
  
  if (user) {
    res.status(200).json({ message: 'Login successful', username: user.name, role: 'user' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

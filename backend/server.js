const express = require('express');
const app = express();
require('dotenv').config();

const { connectDB } = require('./db');
const userRoutes = require('./routes/user.route.js');
const groupRoutes = require('./routes/group.route.js');
const expenseRoutes = require('./routes/expense.route.js');

const cors = require('cors');
const bodyParser = require('body-parser');

// ✅ 1. Connect to MongoDB
connectDB();

// ✅ 2. Middleware
app.use(cors({
  origin: 'http://localhost:3000', // your frontend origin
  credentials: true
}));

app.use(bodyParser.json()); // For parsing application/json

// ✅ 3. Routes
app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/expense', expenseRoutes);

// ✅ 4. Default route
app.get('/', (req, res) => {
  res.send("Hello! Backend is running and connected.");
});

// ✅ 5. Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});

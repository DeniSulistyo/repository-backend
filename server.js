const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const documentRoutes = require('./src/routes/documents');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


module.exports = app;

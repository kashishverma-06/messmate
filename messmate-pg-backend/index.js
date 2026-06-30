const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();

console.log(process.env.JWT_SECRET);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {  //me
  console.log(`Server running on port ${PORT}`);  //me 
});

const sequelize = require('./config/db');
const Mess = require('./models/mess');
const profileRoutes = require('./routes/auth');

app.use(express.json());
app.use(cors());

const messRoutes = require('./routes/messRoutes');
const authRoutes = require('./routes/auth');
app.use('/messes', messRoutes);
app.use('/api/auth', authRoutes);
//app.use('/profile', profileRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Models synced to database');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB error:', err.message);
  });
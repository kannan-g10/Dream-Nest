const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 8000;

/* ROUTES */
app.use('/auth', authRoutes);

// MONGODB SETUP
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: 'Dream_Nest',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, console.log(`server connected in port ${PORT}`));
  })
  .catch((e) => console.log(`${e} did not connect`));

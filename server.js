require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./utils/connectDB');
const path = require('path');
const app = express();

// Cloud Mongodb Atlas
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/campaign', require('./routes/campaign.route'));
app.use('/api/donation', require('./routes/donation.route'));
app.use('/api/fundraiser', require('./routes/fundraiser.route'));
app.use('/api/type', require('./routes/type.route'));
app.use('/api/withdraw', require('./routes/withdraw.route'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}.`)
);

module.exports = app;

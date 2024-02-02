const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
});

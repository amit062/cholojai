const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  division: { type: String },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5, default: 4.5 },
  category: { type: String, enum: ['Nature', 'Historical', 'Beach', 'Hill', 'Wildlife', 'Mountain', 'City'] },
  slug: { type: String, unique: true, sparse: true },
  topSpots: [{
    name: String,
    description: String,
    imageUrl: String,
    gallery: [String],
    tourGuide: String,
    directions: String,
    transportCost: String,
    suppliesNeeded: String
  }],
  hotelOptions: [{
    name: String,
    price: String,
    category: String,
    bookingUrl: String
  }],
  restaurants: [{
    name: String,
    specialty: String,
    priceRange: String,
    description: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);

require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const sampleDestinations = [
  {
    name: "Cox's Bazar",
    location: "Chattogram Division",
    description: "The world's longest natural sea beach, with golden sand and spectacular sunsets over the Bay of Bengal.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cox%27s_Bazar_Sunset.JPG",
    rating: 4.8,
    category: "Beach",
    slug: "coxs-bazar",
    topSpots: [{ 
      name: "Inani Beach", 
      description: "Known for its unique coral stones.", 
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Inani_beach%2C_Cox%27s_bazar.jpg",
      tourGuide: "Hire a CNG from Kolatoli."
    }],
    hotelOptions: [{ name: "Sayeman Beach Resort", price: "7,000 BDT", category: "Luxury", bookingUrl: "#" }]
  },
  {
    name: "Sylhet",
    location: "Sylhet Division",
    description: "Land of tea gardens and the mystical Ratargul freshwater swamp forest.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Ratargul_Swamp_Forest_02.jpg",
    rating: 4.9,
    category: "Nature",
    slug: "sylhet",
    topSpots: [{ 
      name: "Ratargul Swamp", 
      description: "A mystical freshwater swamp forest. Trees emerging from the emerald water.", 
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Ratargul_Swamp_Forest_02.jpg",
      tourGuide: "Take a CNG from Amberkhana." 
    }],
    hotelOptions: [{ name: "Grand Sylhet Hotel", price: "8,500 BDT", category: "Luxury", bookingUrl: "#" }]
  },
  {
    name: "Bandarban",
    location: "Chittagong Hill Tracts",
    description: "Cloud-kissed peaks, waterfalls, and rich indigenous cultural heritage.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Nilgiri%2C_Bandarban.jpg",
    rating: 4.9,
    category: "Hill",
    slug: "bandarban",
    topSpots: [{ 
      name: "Nilgiri", 
      description: "The highest mountain peak where the resort is surrounded by clouds.", 
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Nilgiri%2C_Bandarban.jpg",
      tourGuide: "Hire a Chander Gari (Jeep) from Bandarban town."
    }],
    hotelOptions: [{ name: "Sairu Hill Resort", price: "12,000 BDT", category: "Luxury", bookingUrl: "#" }]
  },
  {
    name: "Sundarbans",
    location: "Khulna Division",
    description: "The largest mangrove forest on Earth, home to the Royal Bengal Tiger.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Tiger_in_Sundarbans.jpg",
    rating: 4.9,
    category: "Nature",
    slug: "sundarbans",
    topSpots: [{ 
      name: "Katka Beach", 
      description: "A beautiful area to spot wildlife.", 
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Mithakhali_Sundarbans.jpg",
      tourGuide: "Book a guided tour from Khulna."
    }],
    hotelOptions: []
  },
  {
    name: "Sajek Valley",
    location: "Rangamati",
    description: "The queen of hills in Bangladesh, famous for rolling clouds over the mountains.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Sajek_Valley_Rangamati_%282%29.jpg",
    rating: 4.8,
    category: "Hill",
    slug: "sajek-valley",
    topSpots: [],
    hotelOptions: []
  },
  {
    name: "Srimangal",
    location: "Sylhet Division",
    description: "The tea capital of Bangladesh with rolling green hills of tea estates.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Tea_Garden_in_Sreemangal.jpg",
    rating: 4.7,
    category: "Nature",
    slug: "srimangal",
    topSpots: [],
    hotelOptions: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecting to Cholojai Database...');
    await Destination.deleteMany({});
    await Destination.insertMany(sampleDestinations);
    console.log('🌱 Seeded with 100% Authentic Geographic Imagery!');
    process.exit();
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
};

seedDB();

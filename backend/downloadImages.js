require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const { pipeline } = require('stream/promises');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const imagesDir = path.join(__dirname, '../frontend/public/images');
const destDir = path.join(imagesDir, 'destinations');
const spotsDir = path.join(imagesDir, 'spots');

[imagesDir, destDir, spotsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const downloadImage = async (url, filepath) => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.google.com/'
      }
    });

    if (!res.ok) throw new Error(`Unexpected response ${res.statusText}`);

    const writer = fs.createWriteStream(filepath);
    await pipeline(res.body, writer);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    const fallbackUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=640&q=80';
    try {
        const fbRes = await fetch(fallbackUrl);
        const writer = fs.createWriteStream(filepath);
        await pipeline(fbRes.body, writer);
        return true;
    } catch {
        return false;
    }
  }
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const destinations = await Destination.find({});
    console.log(`Found ${destinations.length} destinations to process...`);

    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      console.log(`Processing: ${dest.name}...`);
      
      // Download destination main image
      if (dest.imageUrl && dest.imageUrl.startsWith('http')) {
        const ext = '.jpg';
        const filename = `${dest.slug}${ext}`;
        const filepath = path.join(destDir, filename);
        await downloadImage(dest.imageUrl, filepath);
        dest.imageUrl = `/images/destinations/${filename}`;
        console.log(`  -> Main image saved to /images/destinations/${filename}`);
      }

      // Download spot images
      for (let j = 0; j < dest.topSpots.length; j++) {
        const spot = dest.topSpots[j];
        if (spot.imageUrl && spot.imageUrl.startsWith('http')) {
          const filename = `${dest.slug}-spot-${j + 1}.jpg`;
          const filepath = path.join(spotsDir, filename);
          await downloadImage(spot.imageUrl, filepath);
          spot.imageUrl = `/images/spots/${filename}`;
          console.log(`  -> Spot image saved to /images/spots/${filename}`);
        }
      }

      // Save updated document back to mongo
      await dest.save();
    }

    console.log('\n🎉 ALL IMAGES DOWNLOADED AND DATABASE UPDATED SUCCESSFULLY!');
    process.exit(0);

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();

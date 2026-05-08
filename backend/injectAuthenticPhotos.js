require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../cholojai-authentic-photos');
const publicImagesDir = path.join(__dirname, '../frontend/public');
const targetAuthenticDir = path.join(publicImagesDir, 'images/authentic');

// Ensure target dir exists
if (!fs.existsSync(targetAuthenticDir)) {
    fs.mkdirSync(targetAuthenticDir, { recursive: true });
}

// Helper to normalize strings for comparison (removes spaces, quotes, etc and lowercases)
const normalizeString = (str) => {
    return str.replace(/['\s]/g, '').toLowerCase();
};

// Safe delete function for garbage collection
const deleteOldImage = (oldUrl) => {
    if (!oldUrl) return;
    if (oldUrl.startsWith('/images/')) {
        const fullOldPath = path.join(publicImagesDir, oldUrl);
        if (fs.existsSync(fullOldPath)) {
            fs.unlinkSync(fullOldPath);
            console.log(`   └─ 🗑️ Deleted old placeholder: ${oldUrl}`);
        }
    }
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const destinations = await Destination.find({});
        console.log(`Loaded ${destinations.length} destinations from DB.`);

        const files = fs.readdirSync(sourceDir);
        console.log(`Found ${files.length} authentic photos provided by user.`);

        for (const file of files) {
            if (!file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.png')) continue;
            
            let destNamePart = "";
            let spotNamePart = "";

            const basename = file.replace(/\.(jpeg|jpg|png)$/i, '');
            // Check if it's a Spot Image (contains "-")
            if (basename.includes('-')) {
                // Split at the first dash. E.g. "Coxs Bazar-Inani Beach" -> ["Coxs Bazar", "Inani Beach"]
                const dashIndex = basename.indexOf('-');
                destNamePart = basename.substring(0, dashIndex);
                spotNamePart = basename.substring(dashIndex + 1);
            } else {
                // It's a Destination Main Image
                destNamePart = basename;
            }

            // Find matching destination
            const normDestInput = normalizeString(destNamePart);
            let targetDest = destinations.find(d => normalizeString(d.name) === normDestInput);

            // Edge cases for typos
            if (!targetDest && normDestInput === 'bandorban') targetDest = destinations.find(d => normalizeString(d.name) === 'bandarban');
            
            if (targetDest) {
                const cleanFilename = file.replace(/ /g, '_'); // Replace spaces with underscores for safe URL
                const targetFilePath = path.join(targetAuthenticDir, cleanFilename);
                const newDbUrl = `/images/authentic/${cleanFilename}`;

                if (spotNamePart) {
                    // Match the spot
                    const normSpotInput = normalizeString(spotNamePart);
                    // Sometimes the user named it slightly off? Using .includes or exact norm match
                    const targetSpot = targetDest.topSpots.find(s => normalizeString(s.name) === normSpotInput || normalizeString(s.name).includes(normSpotInput));
                    
                    // Special edge cases for spots missing words
                    let matchedSpot = targetSpot;
                    if (!matchedSpot && normSpotInput === 'mainbeach') matchedSpot = targetDest.topSpots.find(s => normalizeString(s.name).includes('mainbeach'));

                    if (matchedSpot) {
                        // Move file & GC old one
                        deleteOldImage(matchedSpot.imageUrl);
                        fs.copyFileSync(path.join(sourceDir, file), targetFilePath);
                        matchedSpot.imageUrl = newDbUrl;
                        console.log(`📸 Spot mapped: ${file} -> ${targetDest.name} > ${matchedSpot.name}`);
                    } else {
                        console.log(`⚠️  Could not find matching spot for: ${spotNamePart} in ${targetDest.name}`);
                    }
                } else {
                    // It's a destination main image
                    deleteOldImage(targetDest.imageUrl);
                    fs.copyFileSync(path.join(sourceDir, file), targetFilePath);
                    targetDest.imageUrl = newDbUrl;
                    console.log(`🗺️  Destination mapped: ${file} -> ${targetDest.name}`);
                }
            } else {
                console.log(`❌ Could not find matching Destination for: ${destNamePart}`);
            }
        }

        // Save all modified destination docs
        for (const d of destinations) {
            await d.save();
        }

        console.log('\n🎉 ALL AUTHENTIC PHOTOS INJECTED AND OLD JUNK PURGED!');
        process.exit(0);

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();

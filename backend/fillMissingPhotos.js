const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../cholojai-authentic-photos');

// We will copy missing main destination photos from their spots
const missingMap = {
    'Rangamati.jpg': 'Rangamati-Hanging Bridge.jpg',
    'Kuakata.jpg': 'Kuakata-Main Beach.jpg',
    'Ahsan Manzil.jpg': 'Ahsan Manzil-Ahsan Manzil Museum.jpg',
    'Lalbagh Fort.jpg': 'Lalbagh Fort-Pari Bibi Mausoleum.jpg',
    'Coxs Bazar-Inani Beach.jpg': 'Coxs Bazar.jpg',
    'Bandarban-Golden Temple.jpg': 'Bandarban-Nilgiri Peak.jpg'
};

for (const [missing, fallback] of Object.entries(missingMap)) {
    const missingPath = path.join(sourceDir, missing);
    const fallbackPath = path.join(sourceDir, fallback);
    
    if (!fs.existsSync(missingPath) && fs.existsSync(fallbackPath)) {
        fs.copyFileSync(fallbackPath, missingPath);
        console.log(`Created missing photo ${missing} from ${fallback}`);
    }
}

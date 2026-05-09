const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../cholojai-authentic-photos');
const publicImagesDir = path.join(__dirname, '../frontend/public');
const targetAuthenticDir = path.join(publicImagesDir, 'images/authentic');

if (!fs.existsSync(targetAuthenticDir)) {
    fs.mkdirSync(targetAuthenticDir, { recursive: true });
}

const normalizeString = (str) => {
    return str.replace(/['\s]/g, '').toLowerCase();
};

const deleteOldImage = (oldUrl) => {
    if (!oldUrl) return;
    if (oldUrl.startsWith('/images/')) {
        const fullOldPath = path.join(publicImagesDir, oldUrl);
        if (fs.existsSync(fullOldPath)) {
            try { fs.unlinkSync(fullOldPath); } catch(e){}
        }
    }
};

const run = async () => {
    try {
        console.log('Logging in as admin...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@cholojai.com', password: 'password123' })
        });
        
        if (!loginRes.ok) {
            console.error('Login failed! Check credentials or server status.');
            process.exit(1);
        }
        
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Admin logged in successfully.');

        const res = await fetch('http://localhost:5000/api/destinations');
        const destinations = await res.json();
        
        const files = fs.readdirSync(sourceDir);
        const updatedDestinations = new Map();

        for (const file of files) {
            if (!file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.png')) continue;
            let destNamePart = "";
            let spotNamePart = "";
            const basename = file.replace(/\.(jpeg|jpg|png)$/i, '');
            if (basename.includes('-')) {
                const dashIndex = basename.indexOf('-');
                destNamePart = basename.substring(0, dashIndex);
                spotNamePart = basename.substring(dashIndex + 1);
            } else {
                destNamePart = basename;
            }

            const normDestInput = normalizeString(destNamePart);
            let targetDest = destinations.find(d => normalizeString(d.name) === normDestInput);
            if (!targetDest && normDestInput === 'bandorban') targetDest = destinations.find(d => normalizeString(d.name) === 'bandarban');
            
            if (targetDest) {
                const cleanFilename = file.replace(/ /g, '_');
                const targetFilePath = path.join(targetAuthenticDir, cleanFilename);
                const newDbUrl = `/images/authentic/${cleanFilename}`;

                if (spotNamePart) {
                    const normSpotInput = normalizeString(spotNamePart);
                    let matchedSpot = targetDest.topSpots.find(s => normalizeString(s.name) === normSpotInput || normalizeString(s.name).includes(normSpotInput));
                    if (!matchedSpot && normSpotInput === 'mainbeach') matchedSpot = targetDest.topSpots.find(s => normalizeString(s.name).includes('mainbeach'));

                    if (matchedSpot) {
                        deleteOldImage(matchedSpot.imageUrl);
                        fs.copyFileSync(path.join(sourceDir, file), targetFilePath);
                        matchedSpot.imageUrl = newDbUrl;
                        updatedDestinations.set(targetDest._id, targetDest);
                    }
                } else {
                    deleteOldImage(targetDest.imageUrl);
                    fs.copyFileSync(path.join(sourceDir, file), targetFilePath);
                    targetDest.imageUrl = newDbUrl;
                    updatedDestinations.set(targetDest._id, targetDest);
                }
            }
        }

        console.log(`\nUpdating ${updatedDestinations.size} destinations via API...`);
        for (const [id, dest] of updatedDestinations.entries()) {
            const putRes = await fetch(`http://localhost:5000/api/destinations/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dest)
            });
            if (!putRes.ok) {
                console.error(`Failed to update ${dest.name}: ${putRes.statusText}`);
            } else {
                console.log(`✅ Updated ${dest.name}`);
            }
        }
        console.log('\n🎉 ALL AUTHENTIC PHOTOS INJECTED AND OLD JUNK PURGED!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};
run();

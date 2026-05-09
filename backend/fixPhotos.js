const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../cholojai-authentic-photos');
const targetAuthenticDir = path.join(__dirname, '../frontend/public/images/authentic');
const routesPath = path.join(__dirname, 'routes/destinationRoutes.js');

if (!fs.existsSync(targetAuthenticDir)) {
    fs.mkdirSync(targetAuthenticDir, { recursive: true });
}

const normalizeString = (str) => str.replace(/['\s]/g, '').toLowerCase();

console.log('Copying authentic photos...');
const files = fs.readdirSync(sourceDir);
const filenameMap = {}; // mapping from normalized name to new URL

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

    const cleanFilename = file.replace(/ /g, '_');
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetAuthenticDir, cleanFilename));
    
    const newUrl = `/images/authentic/${cleanFilename}`;
    
    if (spotNamePart) {
        filenameMap[normalizeString(spotNamePart)] = newUrl;
        if(normalizeString(spotNamePart) === 'mainbeach') filenameMap['kuakatamainbeach'] = newUrl;
        if(normalizeString(spotNamePart) === 'mainbeach') filenameMap['patengamainbeach'] = newUrl;
    } else {
        filenameMap[normalizeString(destNamePart)] = newUrl;
        if (normalizeString(destNamePart) === 'bandorban') filenameMap['bandarban'] = newUrl;
    }
}
console.log('Photos copied to frontend/public/images/authentic');

console.log('Updating destinationRoutes.js fallback destinations...');
let routesCode = fs.readFileSync(routesPath, 'utf8');

// We will use a regex to find imageUrl: `...` and replace it
// But it's safer to just eval the fallbackDestinations, modify them, and rebuild that part of the file?
// Actually, it's easier to just find the names and replace the URLs.
// Since the file is structured, let's just do a manual string replace for each destination and spot.

const destinationsCodeStr = routesCode.substring(
    routesCode.indexOf('const fallbackDestinations = ['),
    routesCode.indexOf('];\n\nrouter.get(') + 2
);

// Very hacky but safe way: we extract the array, modify it, and stringify it back.
// Since we only need to change imageUrl, let's just do regex replaces on the string.
let modifiedCodeStr = destinationsCodeStr;

// We will iterate over all keys in filenameMap
// Wait, the easiest way is to parse it by matching the `name: "..."` and `imageUrl: ...`
const nameRegex = /name:\s*"([^"]+)"/g;
let match;
const nameToUrlRegexes = [];

while ((match = nameRegex.exec(destinationsCodeStr)) !== null) {
    const name = match[1];
    const normName = normalizeString(name);
    let newUrl = filenameMap[normName];
    
    // some manual fallbacks for spots that have slightly different names
    if (!newUrl) {
        // try finding a partial match in the filenameMap keys
        for(const k of Object.keys(filenameMap)) {
            if(normName.includes(k) || k.includes(normName)) {
                newUrl = filenameMap[k];
                break;
            }
        }
    }

    if (newUrl) {
        // we need to find the imageUrl that comes *after* this name
        // this is tricky with regex. Let's do it by splitting.
    }
}

const WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb';
let newFallbackDestinations = eval(destinationsCodeStr.replace('const fallbackDestinations = ', ''));

for (let d of newFallbackDestinations) {
    const normDest = normalizeString(d.name);
    let url = filenameMap[normDest] || filenameMap[normDest.replace('bandorban', 'bandarban')];
    if (url) d.imageUrl = url;

    for (let s of d.topSpots) {
        const normSpot = normalizeString(s.name);
        let sUrl = filenameMap[normSpot];
        if (!sUrl) {
            for(const k of Object.keys(filenameMap)) {
                if(normSpot.includes(k) || k.includes(normSpot)) {
                    sUrl = filenameMap[k]; break;
                }
            }
        }
        if (sUrl) s.imageUrl = sUrl;
    }
}

const newDestinationsStr = "const fallbackDestinations = " + JSON.stringify(newFallbackDestinations, null, 2) + ";";

routesCode = routesCode.replace(destinationsCodeStr, newDestinationsStr);

fs.writeFileSync(routesPath, routesCode);
console.log('✅ Updated destinationRoutes.js to use authentic photos in fallback data.');

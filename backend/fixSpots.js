const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes/destinationRoutes.js');
let code = fs.readFileSync(routesPath, 'utf8');

const startIndex = code.indexOf('const fallbackDestinations = [');
const endIndex = code.indexOf('];\n\nrouter.get(') + 1;
const jsonStr = code.substring(startIndex + 'const fallbackDestinations = '.length, endIndex);

let fallbackDestinations = eval(jsonStr);

for (let dest of fallbackDestinations) {
    for (let spot of dest.topSpots) {
        if (spot.imageUrl && spot.imageUrl.includes('wikimedia.org')) {
            spot.imageUrl = dest.imageUrl;
            console.log(`Replaced Wikipedia URL for ${dest.name} - ${spot.name} with ${dest.imageUrl}`);
        }
    }
}

const newJsonStr = JSON.stringify(fallbackDestinations, null, 2);
const newCode = code.substring(0, startIndex) + 'const fallbackDestinations = ' + newJsonStr + code.substring(endIndex);

fs.writeFileSync(routesPath, newCode);
console.log('Fixed remaining Wikipedia URLs in spots!');

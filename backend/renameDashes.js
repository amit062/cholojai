const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../cholojai-authentic-photos');
const files = fs.readdirSync(dir);

for (const file of files) {
    // Replace en-dash (–) or em-dash (—) with standard hyphen (-)
    let newName = file.replace(/–/g, '-').replace(/—/g, '-');
    // Replace single quote/apostrophe with standard quote if needed, though fixPhotos strips them
    
    // Also, handle Cox's Bazar -> Coxs Bazar if user typed it with an apostrophe
    if (newName.includes("Cox's Bazar")) {
        newName = newName.replace("Cox's Bazar", "Coxs Bazar");
    }

    if (newName !== file) {
        fs.renameSync(path.join(dir, file), path.join(dir, newName));
        console.log(`Renamed: "${file}" -> "${newName}"`);
    }
}
console.log('File normalization complete.');

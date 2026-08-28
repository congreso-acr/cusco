const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'acrs.html'), 'utf8');

const checks = ['TITANKAYOCC', 'AMARU-HUACHOCOLPA', 'M-281.51543', 'M-370.02996'];
checks.forEach(str => {
    console.log(`Contains "${str}":`, content.includes(str));
});

const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(directory);

let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/fontFamily:\s*["']Urbanist_900Black["']/g, 'fontFamily: theme.fonts.black');
    content = content.replace(/fontFamily:\s*["']Urbanist_700Bold["']/g, 'fontFamily: theme.fonts.bold');
    content = content.replace(/fontFamily:\s*["']Urbanist_600SemiBold["']/g, 'fontFamily: theme.fonts.semiBold');
    content = content.replace(/fontFamily:\s*["']Urbanist_500Medium["']/g, 'fontFamily: theme.fonts.medium');
    content = content.replace(/fontFamily:\s*["']Urbanist_400Regular["']/g, 'fontFamily: theme.fonts.regular');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
});

console.log(`Successfully refactored fonts in ${modifiedCount} files.`);

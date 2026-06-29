const { Jimp } = require('jimp');

const threshold = 15;

async function processImage(filename) {
    const imagePath = `../assets/images/${filename}`;
    try {
        const image = await Jimp.read(imagePath);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            if (r < threshold && g < threshold && b < threshold) {
                const brightness = Math.max(r, g, b);
                const alpha = Math.floor((brightness / threshold) * 255);
                this.bitmap.data[idx + 3] = alpha;
            }
        });
        
        await image.write(imagePath);
        console.log(`Processed ${filename}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function main() {
    await processImage('learning_3d_blob.png');
    await processImage('mentor_3d_blob.png');
    await processImage('jobs_3d_blob.png');
}

main();

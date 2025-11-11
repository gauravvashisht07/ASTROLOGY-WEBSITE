// Image optimization script
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function optimizeImages() {
    const imageDir = path.join(__dirname, '../images');
    
    try {
        // Create WebP versions
        await imagemin([`${imageDir}/*.{jpg,png}`], {
            destination: imageDir,
            plugins: [
                webp({ quality: 75 })
            ]
        });

        // Optimize JPG/PNG images
        await imagemin([`${imageDir}/*.{jpg,png}`], {
            destination: imageDir,
            plugins: [
                mozjpeg({ quality: 75 })
            ]
        });

        // Create responsive sizes
        const images = await fs.readdir(imageDir);
        const sizes = [320, 640, 1024, 1920];

        for (const image of images) {
            if (!/\.(jpg|png)$/i.test(image)) continue;

            const imagePath = path.join(imageDir, image);
            for (const size of sizes) {
                const resizedImage = `${path.parse(imagePath).name}-${size}${path.parse(imagePath).ext}`;
                await sharp(imagePath)
                    .resize(size, null, { withoutEnlargement: true })
                    .toFile(path.join(imageDir, resizedImage));
            }
        }

        console.log('✅ Image optimization completed');
    } catch (error) {
        console.error('❌ Image optimization failed:', error);
    }
}

optimizeImages();
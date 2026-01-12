
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const SIZES = [360, 480, 600, 768, 800, 1024];
const ASSETS_DIR = './public/assets';

async function optimizeImages() {
    try {
        const files = await readdir(ASSETS_DIR);

        for (const file of files) {
            // Filter for image files, excluding existing resized versions
            if (!file.match(/\.(png|jpg|jpeg|webp)$/i) || file.includes('-')) continue;

            // Target pattern images (male1...8, female1...4)
            if (!file.match(/^(male|female)\d+[a-z]?\.(webp|png)$/)) continue;

            const inputPath = join(ASSETS_DIR, file);
            const name = basename(file, extname(file));

            console.log(`Processing ${file}...`);

            // Ensure source is 1200x1200 and WebP
            const image = sharp(inputPath);
            const metadata = await image.metadata();

            if (metadata.width === 1200 && metadata.height === 1200) {
                // Create resized versions
                for (const size of SIZES) {
                    await image
                        .clone()
                        .resize(size, size, { fit: 'cover' })
                        .webp({ quality: 80, effort: 6 })
                        .toFile(join(ASSETS_DIR, `${name}-${size}.webp`));
                }

                // Ensure base is WebP if it wasn't
                if (extname(file) !== '.webp') {
                    await image
                        .webp({ quality: 80 })
                        .toFile(join(ASSETS_DIR, `${name}.webp`));
                }
            }
        }
        console.log('Image optimization complete.');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();

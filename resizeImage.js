'use strict';
const sharp = require('sharp');
const { resizeImageSizes, resizeImages, imageCropTechnique } = require('./config');

module.exports.resizeImage = async (file) => {
    const { buffer, fileName, extension } = file;
   
    try {
        const outputBuffers = await Promise.all(resizeImages.map(async(size) => sharp(buffer)
            .resize(resizeImageSizes[size].width, resizeImageSizes[size].height, {
                fit: sharp.fit[imageCropTechnique],
                withoutEnlargement: true
            })
            .toFormat(extension)
            .toBuffer()
        ));
        return resizeImages.map((size, index) => ({
            buffer: outputBuffers[index],
            fileName: `${size}-${fileName}`,
            size
        }));
    } catch (error) {
        throw error;
    }

}
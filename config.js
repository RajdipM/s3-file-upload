module.exports = {
    maxFileUploadSize: '10Mb',
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    resizeImages: ['large', 'medium', 'thumb'],
    imageCropTechnique: 'contain', // Refer to https://sharp.pixelplumbing.com/api-resize
    resizeImageSizes: {
        large: {
            width: 2048,
            height: 2048
        },
        medium: {
            width: 1024,
            height: 1024
        },
        thumb: {
            width: 300,
            height: 300
        }
    }
}
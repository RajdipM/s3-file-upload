'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { maxFileUploadSize, allowedFileTypes } = require('./config');
const { S3Upload } = require('./S3Upload');
const { resizeImage } = require('./resizeImage');

const rawBodyBuffer = bodyParser.raw({
    limit: maxFileUploadSize, 
    type: '*/*'
});


app.post('/upload/:fileName', rawBodyBuffer, async(req, res) => {
    try {
        const contentType = req.headers['content-type'];
        
        const extension = ((contentType.match(/\/([a-zA-Z0-9]+)/) || [])[1]).toLowerCase();
        if(allowedFileTypes.indexOf(extension) === -1) {
            throw new Error('Invalid file type')
        }
        let { fileName } = req.params;
        // extension from file Name
        // replace extension from fileName with extension from content-type
        if(fileName.match(/\.[a-zA-Z0-9]+$/)) {
            fileName = fileName.replace(/\.[a-zA-Z0-9]+$/, `.${extension}`);
        } else {
            fileName = `${fileName}.${extension}`;
        }

        const originalFile = {
            buffer: req.body,
            fileName,
            extension
        };
        let filesToUpload = [];
        if(contentType.includes('image/')) {
            // Resize the images
            filesToUpload = await resizeImage(originalFile);
        } else {
            // Not image, so upload the original file
            filesToUpload = [ originalFile ];
        }
        // console.log(filesToUpload);
        // Upload the images to S3
        const s3Upload = new S3Upload();
        const result = await Promise.all(filesToUpload.map(async(file) => {
            const { key } = await s3Upload.uploadFile( file.buffer, file.fileName, { ACL: 'public-read', pathPrefix: 'uploads' + ( file.size ? '/' + file.size : '') } );
            return key;
        }));

        res.json({
            status: 'success',
            uploadedPaths: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
    
});

app.listen(process.env.PORT || 3000).on('listening', () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});
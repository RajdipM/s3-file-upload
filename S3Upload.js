'use strict';
const AWS = require( 'aws-sdk' );
const { 'v4': uuid } = require( 'uuid' );
class S3Upload {
    constructor() {
        if(!process.env.AWS_ACCESS_KEY_ID) {
            throw new Error('AWS_ACCESS_KEY_ID is required');
        }
        if(!process.env.AWS_SECRET_ACCESS_KEY) {
            throw new Error('AWS_SECRET_ACCESS_KEY is required');
        }
        this.S3 = new AWS.S3( {
            'accessKeyId': process.env.ACCESS_KEY_ID,
            'secretAccessKey': process.env.SECRET_ACCESS_KEY
        } );
    }

    /**
     * Upload By Params
     * @returns {Promise<unknown>}
     * @param buffer
     * @param fileName
     * @param [ops] Options
     * @param {string} [ops.pathPrefix] Path Prefix
     * @param {'private' | 'public-read' | 'public-read-write' | 'aws-exec-read'} [ops.ACL] Path Prefix
     */
    async uploadFile( buffer, fileName, ops = { ACL: 'public-read' } ) {
        try {
            let Key = `${uuid()}-${fileName}`;
            if(ops.pathPrefix) {
                Key = `${ops.pathPrefix}/${Key}`;
            }
            const params = {
                ACL: ops.ACL,
                Bucket: process.env.BUCKET_NAME,
                Key,
                Body: buffer
            };
            return new Promise( ( resolve, reject ) => {
                this.S3.upload( params, ( error, data ) => {
                    if ( error ) {
                        return reject( error );
                    }
                    return resolve( data );
                } );
            } );
        } catch (e) {
            throw e;
        }

    }
}
module.exports = { S3Upload };

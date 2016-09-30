"use strict";

const ImageData   = require("./ImageData");
const sharp = require('sharp');

class ImageResizer {

    constructor(options) {
        this.options = options;
    }

    exec(image) {
        const acl = this.options.acl;

        return new Promise((resolve, reject) => {
            function toBufferHandler(err, buffer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new ImageData(
                        image.fileName,
                        image.bucketName,
                        buffer,
                        image.headers,
                        acl
                    ));
                }
            }

            sharp(image.data)
	    .png()
	    .resize(this.options.size, this.options.size)
	    .max()
	    .withoutEnlargement()
            .toBuffer(toBufferHandler);
        });
    }
}

module.exports = ImageResizer;

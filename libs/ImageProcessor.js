"use strict";

const ImageResizer = require("./ImageResizer");
const S3           = require("./S3");

class ImageProcessor {

    constructor(s3Object) {
        this.s3Object = s3Object;
    }

    run(config) {
        if ( ! config.get("bucket") ) {
            config.set("bucket", this.s3Object.bucket.name);
        }

        return S3.getObject(
            this.s3Object.bucket.name,
            unescape(this.s3Object.object.key.replace(/\+/g, ' '))
        )
        .then((imageData) => this.processImage(imageData, config))
        .then(S3.putObjects);
    }

    processImage(imageData, config) {
        const promiseList   = config.get("resizes", []).filter((option) => {
            return option.size &&
                imageData.fileName.indexOf(option.directory) !== 0 // don't process images in the output folder
        }).map((option) => {
            return this.execResizeImage(option, imageData);
        });

        return Promise.all(promiseList);
    }

    execResizeImage(option, imageData) {
        const resizer = new ImageResizer(option);

        return resizer.exec(imageData)
        .then((resizedImage) => {
            const reducer = new ImageReducer(option);

            return reducer.exec(resizedImage);
        });
    }
}

module.exports = ImageProcessor;

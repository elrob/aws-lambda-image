"use strict";

const ImageData = require("./ImageData");
const sharp = require('sharp');
const path = require("path");

class ImageResizer {

  constructor(options) {
    var sizes = options.size.split('x');
    this.width = parseInt(sizes[0]);
    this.height = parseInt(sizes[1]);
    this.directory = options.directory;
    this.acl = options.acl;
  }

  exec(image) {
    var that = this;
    return new Promise((resolve, reject) => {

      function toBufferHandler(err, buffer) {
        if (err) {
          reject(err);
        } else {
          resolve(new ImageData(
            path.join(that.directory, path.basename(image.fileName, path.extname(image.fileName)) + '.png'),
            image.bucketName,
            buffer,
            image.headers,
            that.acl
          ));
        }
      }

      sharp(image.data)
      .png()
      .resize(this.width, this.height)
      .max()
      .withoutEnlargement()
      .toBuffer(toBufferHandler);
    });
  }
}

module.exports = ImageResizer;

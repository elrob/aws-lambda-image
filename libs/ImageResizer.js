"use strict";

const ImageData   = require("./ImageData");
const gm = require("gm").subClass({ imageMagick: true });

const cropSpec = /(\d+)x(\d+)([+-]\d+)?([+-]\d+)?(%)?/;

class ImageResizer {

    /**
     * Image Resizer
     * resize image with ImageMagick
     *
     * @constructor
     * @param Number width
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Execute resize
     *
     * @public
     * @param ImageData image
     * @return Promise
     */
    exec(image) {
      var sys = require('sys')

      var exec = require('child_process').exec;

      function puts(error, stdout, stderr) { sys.puts(stdout) }

      exec("convert --version", puts);

        console.log('Resize image: ' + image.fileName);
        console.log('Resize image size: ' + image.data.length);
        var toType = function(obj) {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        };
        console.log('image data type: ' + toType(image.data));
        const acl = this.options.acl;

        return new Promise((resolve, reject) => {
            var img = gm(image.data)
	              .geometry(this.options.size.toString())
                      .toBuffer(function (err, buffer) {
                         console.log('buffer: ' + buffer.length);
                         if (err) 
                           reject(err);
			 resolve(new ImageData(
						 image.fileName,
						 image.bucketName,
						 buffer,
						 image.headers,
						 acl
					      )); 
			 })});
                              


    }
}

module.exports = ImageResizer;

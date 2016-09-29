/**
 * Automatic Image resize, reduce with AWS Lambda
 * Lambda main handler
 *
 * @author Yoshiaki Sugimoto
 * @created 2015/10/29
 */
"use strict";

const ImageProcessor = require("./libs/ImageProcessor");
const Config         = require("./libs/Config");
const fs             = require("fs");
const path           = require("path");

// Lambda Handler
exports.handler = (event, context) => {
    const s3Object   = event.Records[0].s3;
    const configPath = path.resolve(__dirname, "config.json");
    const processor  = new ImageProcessor(s3Object);
    const config     = new Config(
        JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }))
    );

    process.env.PATH = './imagemagick/bin:' + process.env.PATH;
    console.log(process.env.PATH);

    var sys = require('sys')

	    var exec = require('child_process').exec;

    function puts(error, stdout, stderr) { sys.puts(stdout) }

    exec("convert --version", puts);

    processor.run(config)
    .then((processedImages) => {
        var message = "OK, " + processedImages.length + " images were processed.";
        console.log(message);
        context.succeed(message);
    })
    .catch((messages) => {
        if ( messages === "Object was already processed." ) {
            console.log("Image already processed");
            context.succeed("Image already processed");
        } else {
            context.fail("Error processing " + s3Object.object.key + ": " + messages);
        }
    });
};

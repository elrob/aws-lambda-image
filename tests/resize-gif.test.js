"use strict";

const ImageResizer = require("../libs/ImageResizer");
const ImageData    = require("../libs/ImageData");
const sharp = require('sharp');

const expect     = require("chai").expect;
const fs         = require("fs");
const path       = require("path");

describe.only("Resizer", () => {

    it("Resizes GIF", () => {
        const size = 200;
        const resizer = new ImageResizer({size: size});
	const srcPath = path.join(__dirname, "/fixture/fixture.gif");
	const outPath = path.join(__dirname, "/fixture/fixture_resized_from_gif.png");
        const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
        const image   = new ImageData("fixture/fixture.gif", "fixture", buffer);

        resizer.exec(image)
        .then((resized) => {
            fs.writeFileSync(outPath, resized.data, {encoding: "binary"});
            sharp(destPath)
                .metadata()
                .then(function(metadata) {
                    if ( err ) {
                        expect.fail(err);
		    } else {
		        expect(metadata.width).to.equal(size);
			expect(metadata.format).to.equal('png');
                    }
		});
        });
    });

    it("Resizes PNG", () => {
        const size = 250;
        const resizer = new ImageResizer({size: size});
        const fixture = "fixture/fixture.png";
	const srcPath = path.join(__dirname, fixture);
	const outPath = path.join(__dirname, "/fixture/fixture_resized_from_png.png");
        const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
        const image   = new ImageData(fixture, "fixture", buffer);

        resizer.exec(image)
        .then((resized) => {
            fs.writeFileSync(outPath, resized.data, {encoding: "binary"});
            sharp(destPath)
                .metadata()
                .then(function(metadata) {
                    if ( err ) {
                        expect.fail(err);
		    } else {
		        expect(metadata.width).to.equal(size);
			expect(metadata.format).to.equal('png');
                    }
		});
        });
    });

    it("Resizes JPG", () => {
        const size = 300;
        const resizer = new ImageResizer({size: size});
        const fixture = "fixture/fixture.jpg";
	const srcPath = path.join(__dirname, fixture);
	const outPath = path.join(__dirname, "/fixture/fixture_resized_from_jpg.png");
        const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
        const image   = new ImageData(fixture, "fixture", buffer);

        resizer.exec(image)
        .then((resized) => {
            fs.writeFileSync(outPath, resized.data, {encoding: "binary"});
            sharp(destPath)
                .metadata()
                .then(function(metadata) {
                    if ( err ) {
                        expect.fail(err);
		    } else {
		        expect(metadata.width).to.equal(size);
			expect(metadata.format).to.equal('png');
                    }
		});
        });
    });
});

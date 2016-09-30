"use strict";

const ImageResizer = require("../libs/ImageResizer");
const ImageData    = require("../libs/ImageData");
const sharp = require('sharp');

const expect     = require("chai").expect;
const fs         = require("fs");
const path       = require("path");

describe("Resizer", () => {

  it("Resizes GIF", () => {
    const size = "100x120";
    const resizer = new ImageResizer({size: size, acl: "some_acl", directory: "some/output/directory" });
    const srcPath = path.join(__dirname, "/fixture/fixture.gif");
    const outPath = path.join(__dirname, "/fixture/fixture_resized_from_gif.png");
    const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
    const image   = new ImageData("fixture/fixture.gif", "fixture", buffer);

    sharp(srcPath).metadata().then((metadata) =>
      console.log("input file dimensions: " + metadata.width + 'x' + metadata.height));

    return resizer.exec(image)
    .then((resized) => {
      expect(resized.fileName).to.equal('some/output/directory/fixture.png');
      return sharp(outPath).metadata()
    })
    .then((metadata) => {
      expect(metadata.width).to.equal(100);
      expect(metadata.format).to.equal('png');
    });
  });

  it("Resizes PNG", () => {
    const size = "105x115";
    const resizer = new ImageResizer({size: size, acl: "some_acl", directory: "some/output/directory" });
    const fixture = "fixture/fixture.png";
    const srcPath = path.join(__dirname, fixture);
    const outPath = path.join(__dirname, "/fixture/fixture_resized_from_png.png");
    const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
    const image   = new ImageData(fixture, "fixture", buffer);

    sharp(srcPath).metadata().then((metadata) =>
      console.log("input file dimensions: " + metadata.width + 'x' + metadata.height));

    return resizer.exec(image)
    .then((resized) => {
      expect(resized.fileName).to.equal('some/output/directory/fixture.png');
      return sharp(outPath).metadata()
    })
    .then((metadata) => {
      expect(metadata.height).to.equal(115);
      expect(metadata.format).to.equal('png');
    });
  });

  it("Resizes JPG", () => {
    const size = "80x90";
    const resizer = new ImageResizer({size: size, acl: "some_acl", directory: "some/output/directory" });
    const fixture = "fixture/fixture.jpg";
    const srcPath = path.join(__dirname, fixture);
    const outPath = path.join(__dirname, "/fixture/fixture_resized_from_jpg.png");
    const buffer  = fs.readFileSync(srcPath, {encoding: "binary"});
    const image   = new ImageData(fixture, "fixture", buffer);

    sharp(srcPath).metadata().then((metadata) =>
      console.log("input file dimensions: " + metadata.width + 'x' + metadata.height));

    return resizer.exec(image)
    .then((resized) => {
      expect(resized.fileName).to.equal('some/output/directory/fixture.png');
      return sharp(outPath).metadata()
    })
    .then((metadata) => {
      expect(metadata.height).to.equal(90);
      expect(metadata.format).to.equal('png');
    });
  });
});

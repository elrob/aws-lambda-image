"use strict";

const ImageProcessor = require("../libs/ImageProcessor");
const ImageData      = require("../libs/ImageData");
const Config         = require("../libs/Config");
const S3             = require("../libs/S3");

const sinon      = require("sinon");
const expect     = require("chai").expect;
const fs         = require("fs");
const path       = require("path");
const sourceFile = path.join(__dirname, "/fixture/event_source.json");
const setting    = JSON.parse(fs.readFileSync(sourceFile));
const gifImage   = "/fixture/fixture.gif";

describe("Optimize GIF Test Rob", () => {
    let processor;

    before(() => {
        sinon.stub(S3, "getObject", () => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(__dirname, gifImage), {encoding: "binary"}, (err, data) => {
                    if ( err ) {
                        reject(err);
                    } else {
                        resolve(new ImageData(
                            "test.gif",
                            setting.Records[0].s3.bucket.name,
                            data
                        ));
                    }
                });
            });
        });
        sinon.stub(S3, "putObjects", (images) => {
            return Promise.all(images.map((image) => {
                return image;
            }));
        });
    });

    after(() => {
        S3.getObject.restore();
        S3.putObjects.restore();
    });

    beforeEach(() => {
        processor = new ImageProcessor(setting.Records[0].s3, {
            done: () => {},
            fail: () => {}
        });
    });

    it("Reduce GIF with basic configuration", (done) => {
        processor.run(new Config({
            reduce: {}
        }))
        .then((images) => {
            expect(images).to.have.length(1);
            const image = images.shift();
            const buf = fs.readFileSync(path.join(__dirname, gifImage), {encoding: "binary"});

            expect(image.bucketName).to.equal(setting.Records[0].s3.bucket.name);
            expect(image.fileName).to.equal("test.gif");
            expect(image.data.length).to.be.above(0)
                                          .and.be.below(buf.length);
            done();
        })
        .catch((messages) => {
            console.log(messages);
            done();
        });
    });

    it("Reduce GIF with bucket/directory configuration", (done) => {
        processor.run(new Config({
            "bucket": "some",
            "reduce": {
                "directory": "resized"
            }
        }))
        .then((images) => {
            expect(images).to.have.length(1);
            const image = images.shift();
            const buf = fs.readFileSync(path.join(__dirname, gifImage), {encoding: "binary"});

            expect(image.bucketName).to.equal("some");
            expect(image.fileName).to.equal("resized/test.gif");
            expect(image.data.length).to.be.above(0)
                                         .and.be.below(buf.length);
            done();
        })
        .catch((messages) => {
            console.log(messages);
            done();
        });
    });

    it("Resize GIF", () => {
        return processor.run(new Config({
            "resizes": [{
                "size": 200,
                "directory": "resized/small"
            }]
        }))
        .then((images) => {
            expect(images).to.have.length(1);
            const image = images.shift();
            const buf = fs.readFileSync(path.join(__dirname, gifImage), {encoding: "binary"});

            expect(image.fileName).to.equal("resized/small/test.gif");
            expect(image.data.length).to.be.above(0)
                                         .and.be.below(buf.length);
        });
    });
});

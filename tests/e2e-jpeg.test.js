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
const event      = JSON.parse(fs.readFileSync(sourceFile));

describe("Resize JPEG Test", () => {
    let processor;

    before(() => {
        sinon.stub(S3, "getObject", () => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(__dirname, "/fixture/fixture.jpg"), {encoding: "binary"}, (err, data) => {
                    if ( err ) {
                        reject(err);
                    } else {
                        resolve(new ImageData(
                            event.Records[0].s3.object.key,
                            event.Records[0].s3.bucket.name,
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
        processor = new ImageProcessor(event.Records[0].s3, {
            done: () => {},
            fail: () => {}
        });
    });

    it("Reduce JPEG with bucket/directory configuration", () => {
        return processor.run(new Config({
            "resizes": [{
              "size": "40x50",
              "directory": "some/path/for/resized"
            }]
        }))
        .then((images) => {
            expect(images).to.have.length(1);
            const image = images.shift();
            const buf = fs.readFileSync(path.join(__dirname, "/fixture/fixture.jpg"), {encoding: "binary"});

            expect(image.bucketName).to.equal("sourcebucket");
            expect(image.fileName).to.equal("some/path/for/resized/HappyFace.png");
            expect(image.data.length).to.be.above(0).and.be.below(buf.length);
        });
    });
});

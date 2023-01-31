"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require('sharp');
const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ accessKeyId: "c30376406c354779a13a0ac40e617c0e", secretAccessKey: "4aded4d8f14f15b27d597d5e1c8c653c", endpoint: new AWS.Endpoint("https://contabostorage.com/tsaqofah") });
class UploadsController {
    async store({ request }) {
        let extnames = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
        let size = '20mb';
        const coverImage = request.file('file', {
            size: size,
            extnames: extnames,
        });
        if (!coverImage) {
            return;
        }
        if (!coverImage.isValid) {
            return coverImage.errors;
        }
        if (coverImage) {
            const filename = request.input("uuid") + "." + coverImage.extname;
            const s3 = new AWS.S3();
            let params = {
                Bucket: "sin1",
                Key: filename,
                ACL: 'public-read',
            };
            if (coverImage.type == 'image') {
                const buffer = await sharp(coverImage.tmpPath).resize(1000).toBuffer();
                params.Body = buffer;
                const { key } = await s3.upload(params).promise();
                return "https://sin1.contabostorage.com/a196457ae22540fb8b66fd8bd8a37ae4:tsaqofah/" + key;
            }
            else {
                params.Body = fs.createReadStream(coverImage.tmpPath);
                const { key } = await s3.upload(params).promise();
                return "https://sin1.contabostorage.com/a196457ae22540fb8b66fd8bd8a37ae4:tsaqofah/" + key;
            }
        }
    }
}
exports.default = UploadsController;
//# sourceMappingURL=TsqUploadsController.js.map
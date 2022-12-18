"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require('sharp');
const uuid_1 = require("uuid");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ accessKeyId: "c30376406c354779a13a0ac40e617c0e", secretAccessKey: "4aded4d8f14f15b27d597d5e1c8c653c", endpoint: new AWS.Endpoint("https://contabostorage.com/omoo") });
class UploadsController {
    async store({ request }) {
        const s3 = new AWS.S3();
        let extnames = ['jpg', 'jpeg', 'png', 'gif'];
        let size = '10mb';
        if (request.header('Filetype') == 'video') {
            extnames = ['mp4'];
            size = '100mb';
        }
        else if (request.header('Filetype') == 'pdf') {
            extnames = ['pdf'];
            size = '20mb';
        }
        else if (request.header('Filetype') == 'file') {
            extnames = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
            size = '20mb';
        }
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
            const filename = (0, uuid_1.v4)() + "." + coverImage.extname;
            let params = {
                Bucket: "sin1",
                Key: filename,
                ACL: 'public-read',
            };
            if (coverImage.type == 'image') {
                const buffer = await sharp(coverImage.tmpPath).resize(500).toBuffer();
                params.Body = buffer;
                const { key } = await s3.upload(params).promise();
                return "https://sin1.contabostorage.com/a196457ae22540fb8b66fd8bd8a37ae4:omoo/" + key;
            }
            else if (request.header('Filetype') == 'video') {
                params.Body = fs.createReadStream(coverImage.tmpPath);
                const result = await s3.upload(params).promise();
                return "https://sin1.contabostorage.com/a196457ae22540fb8b66fd8bd8a37ae4:omoo/" + result.Key;
            }
            else {
                await coverImage.moveToDisk("./");
                return Env_1.default.get('FILE_URL') + "/" + coverImage.fileName;
            }
        }
        return "ok";
    }
    async storeVideo({ request }) {
        const s3 = new AWS.S3();
        let location;
        request.multipart.onFile('file', {
            size: '100mb',
            extnames: ['mp4'],
        }, async (part) => {
            const filename = (0, uuid_1.v4)() + "." + part.filename.split(".")[1];
            let params = {
                Bucket: "sin1",
                Key: filename,
                Body: part,
                ACL: 'public-read',
            };
            const result = await s3.upload(params).promise();
            location = result.Location.replace("http", "https");
            return { url: location };
        });
        await request.multipart.process();
        return location;
    }
}
exports.default = UploadsController;
//# sourceMappingURL=UploadsController.js.map
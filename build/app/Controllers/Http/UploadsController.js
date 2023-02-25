"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require('sharp');
const uuid_1 = require("uuid");
const fs = require('fs');
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
class UploadsController {
    async store({ request }) {
        let extnames = ['jpg', 'jpeg', 'png', 'gif'];
        let size = '15mb';
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
            const filename = request.input("uuid", (0, uuid_1.v4)()) + "." + coverImage.extname;
            const folder = request.input("folder", "omoo");
            if (coverImage.type == 'image') {
                const buffer = await sharp(coverImage.tmpPath).resize(500).toBuffer();
                await Drive_1.default.put(folder + "/" + filename, buffer);
                return `https://indotoko.ap-south-1.linodeobjects.com/${folder}/${filename}`;
            }
            else {
                const stream = fs.createReadStream(coverImage.tmpPath);
                await Drive_1.default.put(folder + "/" + filename, stream);
                return `https://indotoko.ap-south-1.linodeobjects.com/${folder}/${filename}`;
            }
        }
        return "ok";
    }
}
exports.default = UploadsController;
//# sourceMappingURL=UploadsController.js.map
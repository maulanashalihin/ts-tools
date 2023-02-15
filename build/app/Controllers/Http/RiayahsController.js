"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class RiayahsController {
    async index({ inertia }) {
        const campaigns = await Database_1.default.from("riayahs").orderBy("id", "desc").limit(10);
        return inertia.render("riayah", { campaigns });
    }
    async create({ inertia }) {
        return inertia.render("riayah-create");
    }
    async store({ request, response }) {
        await Database_1.default.table("riayahs").insert(request.all());
        return response.redirect("/riayah");
    }
    async show({}) { }
    async edit({ inertia, params }) {
        let campaign = await Database_1.default.from("riayahs").where("id", params.id).first();
        return inertia.render("riayah-create", { campaign });
    }
    async update({ request, response, params }) {
        let data = request.except(['id']);
        await Database_1.default.from("riayahs").where("id", params.id).update(data);
        return response.redirect("/riayah", false, 303);
    }
    async destroy({}) { }
    async upload({ request }) {
        const coverImage = request.file('file', {
            size: '20mb',
            extnames: ['jpg', 'png', 'gif', 'mp4', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
        });
        if (!coverImage) {
            return;
        }
        if (!coverImage.isValid) {
            return coverImage.errors;
        }
        if (coverImage) {
            await coverImage.moveToDisk("./");
            return coverImage.fileName;
        }
    }
}
exports.default = RiayahsController;
//# sourceMappingURL=RiayahsController.js.map
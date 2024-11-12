"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const meilisearch_1 = require("meilisearch");
class BankTsaqofahsController {
    async indexOmoo({ auth }) {
        const user = auth.use("api").user;
        if (user) {
            return await Database_1.default.from("bank_tsaqofahs").where("status", "published").orderBy("id", "desc").limit(20);
        }
    }
    async showOmoo({ auth, params }) {
        const user = auth.use("api").user;
        if (user) {
            return await Database_1.default.from("bank_tsaqofahs").where("status", "published").where("id", params.id).first();
        }
    }
    async index({ inertia, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const tsaqofah = await Database_1.default.from("bank_tsaqofahs").where("contributor", user.id);
            return inertia.render("bank-tsaqofah", { tsaqofah });
        }
    }
    async indexAdmin({ inertia, auth }) {
        const user = auth.use("web").user;
        if (user) {
            const tsaqofah = await Database_1.default.from("bank_tsaqofahs").orderBy("id", "desc").limit(20);
            return inertia.render("bank-tsaqofah-admin", { tsaqofah });
        }
    }
    async create({ auth, inertia }) {
        const user = auth.use("buzzer").user;
        if (user) {
            return inertia.render("bank-tsaqofah-upload");
        }
    }
    async store({ request, auth, response }) {
        const user = auth.use("buzzer").user;
        if (user) {
            let data = request.all();
            data.contributor = user.id;
            data.status = "in review";
            await Database_1.default.table("bank_tsaqofahs").insert(data);
            return response.redirect("/bank-tsaqofah");
        }
    }
    async show({ auth, inertia, params }) {
        const user = auth.use("web").user;
        if (user) {
            const content = await Database_1.default.from("bank_tsaqofahs").where("id", params.id).first();
            return inertia.render("bank-tsaqofah-review", { content });
        }
    }
    async edit({ auth, params, inertia }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const content = await Database_1.default.from("bank_tsaqofahs").where("id", params.id).first();
            if (content.contributor == user.id) {
                return inertia.render("bank-tsaqofah-upload", { content });
            }
        }
    }
    async update({ auth, request, params, response }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const tsaqofah = request.all();
            if (tsaqofah.status == 'published') {
                const client = new meilisearch_1.MeiliSearch({
                    host: 'https://ms-095276b6e275-1655.sgp.meilisearch.io',
                    apiKey: '776a10df2bd5c1f6f4197f0561b72afe06d5a081',
                });
                const index = client.index('tsaqofah');
                await index.addDocuments(tsaqofah);
            }
            await Database_1.default.from("bank_tsaqofahs").where("id", params.id).update(request.except(['id', 'updated_at', 'created_at']));
            return response.redirect("/bank-tsaqofah", false, 303);
        }
    }
    async status({ auth, params, request }) {
        const user = auth.use("web").user;
        if (user) {
            const tsaqofah = await Database_1.default.from("bank_tsaqofahs").where("id", params.id).first();
            await Database_1.default.from("bank_tsaqofahs").where("id", params.id).update({ status: request.input("status") });
            const client = new meilisearch_1.MeiliSearch({
                host: 'https://ms-095276b6e275-1655.sgp.meilisearch.io',
                apiKey: '776a10df2bd5c1f6f4197f0561b72afe06d5a081',
            });
            const index = client.index('tsaqofah');
            await index.addDocuments(tsaqofah);
            return "OK";
        }
    }
    async destroy({}) { }
}
exports.default = BankTsaqofahsController;
//# sourceMappingURL=BankTsaqofahsController.js.map
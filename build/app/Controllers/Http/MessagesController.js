"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class MessagesController {
    async index({ inertia }) {
        const messages = await Database_1.default.from("messages");
        for await (const item of messages) {
            item.buttons = JSON.parse(item.buttons);
        }
        const api_keys = await Database_1.default.from("api_keys");
        return inertia.render("messages", { messages, api_keys });
    }
    async create({}) { }
    async store({}) { }
    async show({}) { }
    async storeApiKey({ request }) {
        await Database_1.default.table("api_keys").insert({
            id: request.input("id")
        });
    }
    async deleteApiKey({ params }) {
        await Database_1.default.from("api_keys").where("id", params.id).delete();
    }
    async update({ params, request }) {
        let data = request.except(['id']);
        data.buttons = JSON.stringify(data.buttons);
        await Database_1.default.from("messages").where("id", params.id).update(data);
    }
    async destroy({}) { }
}
exports.default = MessagesController;
//# sourceMappingURL=MessagesController.js.map
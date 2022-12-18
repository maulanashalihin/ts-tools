"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const axios_1 = __importDefault(require("axios"));
class GuestArticlesController {
    async index({}) {
        const check = await Redis_1.default.get("articles");
        if (check) {
            return JSON.parse(check);
        }
        else {
            const response = await axios_1.default.get("https://muslimahnews.net/wp-json/wp/v2/posts?_embed");
            await Redis_1.default.setex("articles", 60 * 60, JSON.stringify(response.data));
            return response.data;
        }
    }
}
exports.default = GuestArticlesController;
//# sourceMappingURL=GuestArticlesController.js.map
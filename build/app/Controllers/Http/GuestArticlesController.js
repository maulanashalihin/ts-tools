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
    async getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    async ayat({}) {
        const check = await Redis_1.default.get("quran");
        if (check) {
            return JSON.parse(check);
        }
        else {
            let surah = await this.getRandomArbitrary(1, 144);
            const response = await axios_1.default.get("https://equran.id/api/surat/" + surah);
            let data = response.data;
            if (data.ayat.length >= 10) {
                data.fromAyat = await this.getRandomArbitrary(0, data.jumlah_ayat - 9);
                data.toAyat = data.fromAyat + 9;
                if (data.toAyat > data.jumlah_ayat) {
                    data.toAyat = data.jumlah_ayat;
                }
            }
            else {
                data.fromAyat = 0;
                data.toAyat = data.jumlah_ayat;
            }
            await Redis_1.default.setex("quran", 60 * 60, JSON.stringify(data));
            return response.data;
        }
    }
}
exports.default = GuestArticlesController;
//# sourceMappingURL=GuestArticlesController.js.map
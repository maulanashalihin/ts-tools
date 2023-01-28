"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chapter_json_1 = __importDefault(global[Symbol.for('ioc.use')]("Database/quran/chapter.json"));
const quran_json_1 = __importDefault(global[Symbol.for('ioc.use')]("Database/quran/quran.json"));
const id_json_1 = __importDefault(global[Symbol.for('ioc.use')]("Database/quran/id.json"));
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const axios_1 = __importDefault(require("axios"));
class QuransController {
    async index({}) {
        return chapter_json_1.default;
    }
    async show({ params, request }) {
        if (params.id) {
            let surah = chapter_json_1.default[params.id - 1];
            let ayats = quran_json_1.default[params.id];
            let bahasa = [];
            if (request.input("translation") == 'id') {
                bahasa = id_json_1.default[params.id];
            }
            return {
                surah,
                ayats,
                bahasa
            };
        }
    }
    async randomAyat({}) {
        let chapter = await this.getRandomArbitrary(1, 114);
        let surah = chapter_json_1.default[chapter - 1];
        let ayats = quran_json_1.default[chapter];
        let fromAyatIndex = 0;
        let toAyatIndex = surah.total_verses - 1;
        let bahasa = id_json_1.default[chapter];
        if (surah.total_verses > 10) {
            fromAyatIndex = await this.getRandomArbitrary(0, surah.total_verses - 9);
            toAyatIndex = fromAyatIndex + 9;
            ayats = ayats.filter((item, index) => {
                if (index >= fromAyatIndex && index <= toAyatIndex)
                    return item;
            });
            bahasa = bahasa.filter((item, index) => {
                if (index >= fromAyatIndex && index <= toAyatIndex)
                    return item;
            });
        }
        return {
            surah,
            fromAyatIndex,
            toAyatIndex,
            ayats,
            bahasa
        };
    }
    async adzan({ params }) {
        let jadwal = await Redis_1.default.get("jadwal-shalat:" + params.location + ":" + params.year + ":" + params.month);
        if (jadwal) {
            return JSON.parse(jadwal);
        }
        else {
            let response = await axios_1.default.get(`https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${params.location}/${params.year}/${params.month}.json`);
            if (response.data) {
                await Redis_1.default.set("jadwal-shalat:" + params.location + ":" + params.year + ":" + params.month, JSON.stringify(response.data));
                return response.data;
            }
        }
    }
    async getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
exports.default = QuransController;
//# sourceMappingURL=QuransController.js.map
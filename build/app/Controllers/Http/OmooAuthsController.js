"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class OmooAuthsController {
    async login({ request, response }) {
        const phone = request.input("phone");
        let buzzer = await Database_1.default.from("troops").where("phone", phone).first();
        if (!buzzer) {
            return response.abort("No.Handphone belum terdaftar", 404);
        }
        const otp = this.getRndInteger(100000, 999999);
        console.log(otp);
        const randomID = (0, uuid_1.v4)();
        await Redis_1.default.setex('otp:' + otp + ":" + randomID, 60 * 5, buzzer.id);
        await Redis_1.default.setex("req-otp:" + phone, 60 * 5, otp);
        const api_key = await Database_1.default.from("api_keys").orderBy(Database_1.default.raw('RAND()')).first();
        if (api_key && process.env.NODE_ENV != 'development') {
            axios_1.default.post("https://api.dripsender.id/send", {
                api_key: api_key.id,
                phone: phone,
                text: otp
            });
        }
        return { randomID, phone: buzzer.phone };
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    async verifyOTP({ request, response, auth }) {
        const otp = request.input("otp");
        const randomID = request.input("randomID");
        const user_id = await Redis_1.default.get('otp:' + otp + ":" + randomID);
        if (user_id) {
            const user = await Database_1.default.from("troops").where("id", user_id).first();
            if (user) {
                await Redis_1.default.del('otp:' + otp + ":" + randomID);
                const token = await auth.use('api').generate(user);
                return token;
            }
        }
        return response.abort("User id tidak ditemukan", 404);
    }
    async check({ auth }) {
        const check = await auth.use("api").check();
        if (check) {
            return await auth.use("api").user;
        }
        else {
            return check;
        }
    }
    async logout({ auth }) {
        const check = await auth.use("api").check();
        if (check) {
            await auth.use('api').logout();
        }
    }
}
exports.default = OmooAuthsController;
//# sourceMappingURL=OmooAuthsController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
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
            const message = await Database_1.default.from("messages").where("id", "otp").first();
            axios_1.default.post("http://api.dripsender.id/send", {
                api_key: api_key.id,
                phone: phone,
                text: message.text,
                type: "buttonsMessage",
                footerText: "Admin TS",
                buttons: JSON.parse(message.buttons)
            });
        }
        return { randomID, phone: buzzer.phone };
    }
    async profile({ auth, request }) {
        const user = auth.use("api").user;
        if (user)
            await Database_1.default.from("troops").where("id", user.id).update(request.except(['id']));
        return "OK";
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
    async verifyToken({ request, response, auth }) {
        const ott = request.input("token");
        const user_id = await Redis_1.default.get(`token:` + ott);
        if (user_id) {
            const user = await Database_1.default.from("troops").where("id", user_id).first();
            if (user) {
                await Database_1.default.from("troops").where("id", user_id).update({ last_active: Date.now() });
                await Redis_1.default.del(`token:` + ott);
                const token = await auth.use('api').generate(user);
                return token;
            }
        }
        return response.abort("User id tidak ditemukan", 404);
    }
    async setPin({ request, auth, response }) {
        const pin = request.input("pin");
        const user = await auth.use("api").user;
        const counter = await Redis_1.default.incr("login-trial:" + user?.id);
        await Redis_1.default.expire("login-trial:" + user?.id, 600);
        console.log(user);
        if (pin && user) {
            if (user.pin_set) {
                const troop = await Database_1.default.from("troops").where("id", user.id).select(["pin_hash"]).first();
                if (await Hash_1.default.verify(troop.pin_hash, pin)) {
                    await Database_1.default.from("troops").where("id", user.id).update({ last_active: Date.now() });
                    await Redis_1.default.expire("login-trial:" + user?.id, 0);
                    return "OK";
                }
                else {
                    if (counter >= 3) {
                        await Database_1.default.from("troops").where("id", user.id).update({ blocked: true });
                        await auth.use('api').logout();
                        return response.abort("Maaf, Anda telah lebih dari 3x percobaan memasukan PIN");
                    }
                    else {
                        return response.abort("Maaf, PIN yang dimasukan salah");
                    }
                }
            }
            else {
                const pin_hash = await Hash_1.default.make(pin);
                await Database_1.default.from("troops").where("id", user.id).update({ pin_hash, last_active: Date.now(), pin_set: true });
                await Redis_1.default.expire("login-trial:" + user?.id, 0);
                return "OK";
            }
        }
    }
    async check({ auth }) {
        const check = await auth.use("api").check();
        if (check) {
            const user = await auth.use("api").user;
            ;
            if (user) {
                await Database_1.default.table("open_rates").insert({
                    date: Date.now().toString(),
                    city: user.city,
                    troop_id: user.id
                });
            }
            return user;
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
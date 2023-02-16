"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class TroopsController {
    async home({ inertia }) {
        const campaigns = await Database_1.default.from("campaigns").where("status", "!=", "done").orderBy("id", "desc").limit(8);
        return inertia.render("ts-home", { campaigns });
    }
    async create({}) { }
    async store({ auth, request }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const twitter_username = request.input("twitter_username");
            const city = request.input("city");
            const gender = request.input("gender");
            const phone = request.input("phone") || user.phone;
            await Database_1.default.from("troops").where("id", user.id).update({
                twitter_username,
                city,
                gender,
                phone
            });
        }
        return "OK";
    }
    async show({}) { }
    async edit({ inertia, auth }) {
        const user = auth.use("buzzer").user;
        return inertia.render("ts-profile", { user });
    }
    async history({ inertia, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const histories = await Database_1.default.from("campaign_attendances").where("troop_id", user.id);
            return inertia.render("ts-history", { user, histories });
        }
    }
    async leaderboard({ inertia, auth }) {
        const user = auth.use("buzzer").user;
        if (user) {
            const leaderboards = await Database_1.default.from("troops").orderBy("score", "desc").limit(100);
            return inertia.render("ts-leaderboard", { user, leaderboards });
        }
    }
    async index({ inertia, request }) {
        const troops = await Database_1.default.from("troops").select(['id', 'score', 'twitter_username', 'name', 'blocked']).orderBy("score", "desc").paginate(request.input("page", 1), 100);
        return inertia.render("troops", { troops });
    }
    async download({ response }) {
        const troops = await Database_1.default.from("troops");
        let csvData = "name,phone,city\n";
        for await (const item of troops) {
            csvData += `${item.twitter_username},${item.phone},${item.city}\n`;
        }
        return response.header("Content-Type", "text/csv").header("Content-Disposition", "attachment; filename=troops.csv").send(csvData);
    }
    async profile({ auth, request, response }) {
        const user = auth.use("buzzer").user;
        if (user)
            await Database_1.default.from("troops").where("id", user.id).update(request.except(['id']));
        return response.redirect().back();
    }
    async update({ params, request }) {
        await Database_1.default.from("troops").where("id", params.id).update(request.except(['id']));
        return "OK";
    }
    async destroy({}) { }
    async requestOTP({ request }) {
        const phone = request.input("phone");
        const otp = await Redis_1.default.get("req-otp:" + phone);
        if (otp) {
            return {
                reply: true,
                text: `Kode OTP anda adalah ${otp}`
            };
        }
        else {
            return {
                reply: true,
                text: `Maaf, Nomor ini belum terdaftar/login`
            };
        }
    }
    async logout({ auth, response }) {
        const check = await auth.use("buzzer").check();
        if (check) {
            await auth.use('buzzer').logout();
            return response.redirect("/ts-login");
        }
        else {
            return response.redirect("/ts-login");
        }
    }
    async register({ request, inertia }) {
        const phone = request.input("phone");
        let buzzer = await Database_1.default.from("troops").where("phone", phone).first();
        if (!buzzer) {
            buzzer = {
                phone,
                twitter_username: request.input("twitter_username"),
                city: request.input("city")
            };
            buzzer.id = await Database_1.default.table("troops").insert(buzzer);
        }
        const otp = this.getRndInteger(100000, 999999);
        console.log(otp);
        const randomID = (0, uuid_1.v4)();
        await Redis_1.default.setex('otp:' + otp + ":" + randomID, 60 * 5, buzzer.id);
        await Redis_1.default.setex("req-otp:" + phone, 60 * 5, otp);
        const api_key = await Database_1.default.from("api_keys").orderBy(Database_1.default.raw('rand()')).first();
        if (process.env.NODE_ENV != 'development') {
            if (api_key) {
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
        }
        return inertia.render("ts-otp", { randomID, phone: buzzer.phone });
    }
    async login({ request, inertia, response, session }) {
        const phone = request.input("phone");
        let buzzer = await Database_1.default.from("troops").where("phone", phone).first();
        if (!buzzer) {
            session.flash('errors', 'No.Handphone belum terdaftar');
            return response.redirect().back();
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
        return inertia.render("ts-otp", { randomID, phone: buzzer.phone });
    }
    async verifyToken({ request, response, auth, session }) {
        const ott = request.input("token");
        const user_id = await Redis_1.default.get(`token:` + ott);
        if (user_id) {
            await Database_1.default.from("troops").where("id", user_id).update({ last_active: Date.now() });
            await auth.use('buzzer').loginViaId(user_id);
            await Redis_1.default.del(`token:` + ott);
            return response.redirect("/pin");
        }
        session.flash("errors", "Maaf, Token yang anda masukan salah.");
        return response.redirect("/ts-login");
    }
    async verifyOTP({ request, response, auth }) {
        const otp = request.input("otp");
        const randomID = request.input("randomID");
        const user_id = await Redis_1.default.get('otp:' + otp + ":" + randomID);
        if (user_id) {
            await auth.use('buzzer').loginViaId(user_id);
            await Redis_1.default.del('otp:' + otp);
            return response.redirect("/", false, 303);
        }
        return response.redirect("/ts-login");
    }
    async pin({ inertia }) {
        return inertia.render("ts-pin");
    }
    async setPin({ request, auth, response, session }) {
        const pin = request.input("pin");
        const user = await auth.use("buzzer").user;
        const counter = await Redis_1.default.incr("login-trial:" + user?.id);
        await Redis_1.default.expire("login-trial:" + user?.id, 600);
        if (pin && user) {
            if (user.pin_set) {
                const troop = await Database_1.default.from("troops").where("id", user.id).select(["pin_hash"]).first();
                if (await Hash_1.default.verify(troop.pin_hash, pin)) {
                    await Database_1.default.from("troops").where("id", user.id).update({ last_active: Date.now() });
                    await Redis_1.default.expire("login-trial:" + user?.id, 0);
                    return response.redirect("/");
                }
                else {
                    if (counter >= 3) {
                        session.flash("errors", "Maaf, Anda telah lebih dari 3x percobaan memasukan PIN");
                        await Database_1.default.from("troops").where("id", user.id).update({ blocked: true });
                        await auth.use('buzzer').logout();
                        return response.redirect("/ts-login");
                    }
                    else {
                        session.flash("errors", "Maaf, PIN yang dimasukan salah");
                        return response.redirect("/pin");
                    }
                }
            }
            else {
                const pin_hash = await Hash_1.default.make(pin);
                await Database_1.default.from("troops").where("id", user.id).update({ pin_hash, last_active: Date.now(), pin_set: true });
                await Redis_1.default.expire("login-trial:" + user?.id, 0);
                return response.redirect("/");
            }
        }
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
exports.default = TroopsController;
//# sourceMappingURL=TroopsController.js.map
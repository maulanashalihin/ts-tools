"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
const Bot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Bot"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const fs_1 = __importDefault(require("fs"));
class BotPool extends standalone_1.BaseCommand {
    async run() {
        Bot_1.default.on('message', async (msg) => {
            const chatId = msg.chat.id;
            if (msg.text == "/help") {
                Bot_1.default.sendMessage(chatId, `Beberapa perintah yang bisa dilakukan untuk bot :
            
      /login - untuk mendapatkan token
      /check_id - untuk mendapatkan user_id anda
      /delete_akun - untuk menghapus akun

      Terima kasih.`);
            }
            else if (msg.text == "LOGIN OMOO" || msg.text == "LOGIN TS" || msg.text == "/login") {
                let troop = await Database_1.default.from("troops").where("tg_id", chatId).first();
                if (!troop) {
                    troop = {
                        tg_id: chatId,
                        name: msg.chat.first_name
                    };
                    troop.id = await Database_1.default.table("troops").insert(troop);
                }
                else {
                    if (troop.blocked) {
                        Bot_1.default.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                }
                const ott = (0, uuid_1.v4)();
                await Redis_1.default.setex(`token:` + ott, 600, troop.id);
                Bot_1.default.sendMessage(chatId, "Silakan gunakan token berikut `" + ott + "`   untuk login ke dalam Aplikasi \n\nPS : klik pada token untuk copy text", { parse_mode: "MarkDown" });
            }
            else if (msg.text == "CHECK ID" || msg.text == "/check_id") {
                Bot_1.default.sendMessage(chatId, "ID anda adalah `" + chatId + "`", { parse_mode: "MarkDown" });
            }
            else if (msg.text == "DELETE AKUN" || msg.text == "/delete_akun") {
                let troop = await Database_1.default.from("troops").where("tg_id", chatId).first();
                if (troop) {
                    if (troop.blocked) {
                        Bot_1.default.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                    await Database_1.default.from("troops").where("tg_id", chatId).delete();
                }
                Bot_1.default.sendMessage(chatId, "ID `" + chatId + "` telah dihapus", { parse_mode: "MarkDown" });
            }
            else {
                Bot_1.default.sendMessage(chatId, "Selamat datang di BOT OMOO. /help", {
                    "reply_markup": {
                        "keyboard": [["LOGIN OMOO", "LOGIN TS"], ["CHECK ID", "DELETE AKUN"]]
                    }
                });
            }
        });
        console.log("bot pool is running");
        setInterval(async () => {
            for (let i = 0; i < 10; i++) {
                const data_ = await Redis_1.default.spop("queue:riayah");
                if (data_) {
                    const data = JSON.parse(data_);
                    if (data.file) {
                        const stream = fs_1.default.createReadStream(Application_1.default.tmpPath('uploads') + "/" + data.file);
                        Bot_1.default.sendPhoto(data.tg_id, stream, { caption: data.text });
                    }
                    else {
                        Bot_1.default.sendMessage(data.tg_id, data.text);
                    }
                }
            }
        }, 1000);
    }
}
exports.default = BotPool;
BotPool.commandName = 'bot:pool';
BotPool.description = '';
BotPool.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=BotPool.js.map
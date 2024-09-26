"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
class Bot {
    constructor(bot) {
        bot.on("text", async (msg) => {
            const chatId = msg.chat.id;
            if (msg.text.toUpperCase() == "LOGIN OMOO" ||
                msg.text.toUpperCase() == "LOGIN TS" ||
                "/login" == msg.text) {
                let troop = await Database_1.default.from("troops")
                    .where("tg_id", chatId)
                    .first();
                if (!troop) {
                    troop = {
                        tg_id: chatId,
                        name: msg.chat.first_name,
                    };
                    try {
                        troop.id = await Database_1.default.table("troops").insert(troop);
                    }
                    catch (error) { }
                }
                else {
                    if (troop.blocked) {
                        bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                }
                const ott = (0, uuid_1.v4)();
                await Redis_1.default.setex(`token:` + ott, 600, troop.id);
                bot.sendMessage(chatId, "Silakan gunakan token di bawah ini  untuk login ke dalam Aplikasi. klik pada token untuk copy text");
                setTimeout(() => {
                    bot.sendMessage(chatId, "`" + ott + "`", { parseMode: "MarkDown" });
                }, 100);
            }
            else if (msg.text == "help") {
                bot.sendMessage(chatId, `Beberapa perintah yang bisa dilakukan untuk bot :
            
                /login - untuk mendapatkan token
                /check_id - untuk mendapatkan user_id anda
                /delete_akun - untuk menghapus akun
          
                Terima kasih.`);
            }
            else if (msg.text == "CHECK ID" || msg.text == "/check_id") {
                bot.sendMessage(chatId, "ID anda adalah `" + chatId + "`", {
                    parseMode: "MarkDown",
                });
            }
            else if (msg.text == "DELETE AKUN" || msg.text == "/delete_akun") {
                let troop = await Database_1.default.from("troops")
                    .where("tg_id", chatId)
                    .first();
                if (troop) {
                    if (troop.blocked) {
                        bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                    await Database_1.default.from("troops").where("tg_id", chatId).delete();
                }
                bot.sendMessage(chatId, "ID `" + chatId + "` telah dihapus", {
                    parseMode: "MarkDown",
                });
            }
            else {
                bot.sendMessage(chatId, "Selamat datang di BOT OMOO. /help", {
                    reply_markup: {
                        keyboard: [
                            ["LOGIN OMOO", "LOGIN TS"],
                            ["CHECK ID", "DELETE AKUN"],
                        ],
                    },
                });
            }
        });
        bot.start();
    }
}
exports.default = Bot;
//# sourceMappingURL=Bot.js.map
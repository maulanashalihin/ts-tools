"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
class Bot {
    constructor(bot) {
        this.bot = bot;
        bot.on('error', (error) => {
            Logger_1.default.error(`Telegram bot error: ${error.message}`);
            console.error('Telegram bot error:', error);
        });
        bot.on("text", async (msg) => {
            const chatId = msg.chat.id;
            console.log(msg);
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
                        this.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                }
                const ott = (0, uuid_1.v4)();
                await Redis_1.default.setex(`token:` + ott, 600, troop.id);
                this.sendMessage(chatId, "Silakan gunakan token di bawah ini  untuk login ke dalam Aplikasi. klik pada token untuk copy text");
                setTimeout(() => {
                    this.sendMessage(chatId, "`" + ott + "`", {
                        parseMode: "MarkDown",
                        reply_markup: this.getMainKeyboard()
                    });
                }, 100);
            }
            else if (msg.text == "/help") {
                this.sendMessage(chatId, `Beberapa perintah yang bisa dilakukan untuk bot :
            
                /login - untuk mendapatkan token
                /check_id - untuk mendapatkan user_id anda
                /delete_akun - untuk menghapus akun
          
                Terima kasih.`, {
                    reply_markup: this.getMainKeyboard()
                });
            }
            else if (msg.text == "CHECK ID" || msg.text == "/check_id") {
                this.sendMessage(chatId, "ID anda adalah `" + chatId + "`", {
                    parseMode: "MarkDown",
                    reply_markup: this.getMainKeyboard()
                });
            }
            else if (msg.text == "DELETE AKUN" || msg.text == "/delete_akun") {
                let troop = await Database_1.default.from("troops")
                    .where("tg_id", chatId)
                    .first();
                if (troop) {
                    if (troop.blocked) {
                        this.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
                        return;
                    }
                    await Database_1.default.from("troops").where("tg_id", chatId).delete();
                }
                this.sendMessage(chatId, "ID `" + chatId + "` telah dihapus", {
                    parseMode: "MarkDown",
                    reply_markup: this.getMainKeyboard()
                });
            }
            else {
                this.sendMessage(chatId, "Selamat datang di BOT OMOO. /help", {
                    reply_markup: this.getMainKeyboard()
                });
            }
        });
        bot.start();
    }
    async sendMessage(chatId, text, options = {}) {
        try {
            return await this.bot.sendMessage(chatId, text, options);
        }
        catch (error) {
            Logger_1.default.error(`Failed to send message to ${chatId}: ${error.message}`);
            console.error(`Failed to send message to ${chatId}:`, error);
            throw error;
        }
    }
    async sendPhoto(chatId, photo, options = {}) {
        try {
            return await this.bot.sendPhoto(chatId, photo, options);
        }
        catch (error) {
            Logger_1.default.error(`Failed to send photo to ${chatId}: ${error.message}`);
            console.error(`Failed to send photo to ${chatId}:`, error);
            throw error;
        }
    }
    async sendDocument(chatId, document, options = {}) {
        try {
            return await this.bot.sendDocument(chatId, document, options);
        }
        catch (error) {
            Logger_1.default.error(`Failed to send document to ${chatId}: ${error.message}`);
            console.error(`Failed to send document to ${chatId}:`, error);
            throw error;
        }
    }
    getMainKeyboard() {
        return {
            keyboard: [
                ["LOGIN OMOO", "LOGIN TS"],
                ["CHECK ID", "DELETE AKUN"]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        };
    }
}
exports.default = Bot;
//# sourceMappingURL=Bot.js.map
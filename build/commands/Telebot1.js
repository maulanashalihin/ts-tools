"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
const TeleBot = require('telebot');
class Telebot1 extends standalone_1.BaseCommand {
    async run() {
        const TELEGRAM_BOT_TOKEN = "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk";
        let bot;
        if (process.env.TG_PORT && process.env.TG_WEBHOOK_URL) {
            bot = new TeleBot({
                token: TELEGRAM_BOT_TOKEN,
                webhook: {
                    url: process.env.TG_WEBHOOK_URL,
                    host: "0.0.0.0",
                    port: process.env.TG_PORT,
                },
            });
        }
        else {
            bot = new TeleBot(TELEGRAM_BOT_TOKEN);
            console.log("bot started");
        }
        bot.on('/start', (msg) => {
            return bot.sendMessage(msg.from.id, 'Selamat datang di BOT OMOO. /help', {
                replyMarkup: {
                    keyboard: [
                        ['LOGIN OMOO', 'LOGIN TS'],
                        ['CHECK ID', 'DELETE AKUN']
                    ],
                    resize: true
                }
            });
        });
        bot.on('text', async (msg) => {
            const chatId = msg.from.id;
            const text = msg.text;
            if (text.toUpperCase() === 'LOGIN OMOO' || text.toUpperCase() === 'LOGIN TS' || text === '/login') {
                let troop = await Database_1.default.from('troops').where('tg_id', chatId).first();
                if (!troop) {
                    troop = {
                        tg_id: chatId,
                        name: msg.chat.type === 'private' ? msg.from.first_name : msg.chat.title,
                    };
                    try {
                        troop.id = await Database_1.default.table('troops').insert(troop);
                    }
                    catch (error) { }
                }
                else if (troop.blocked) {
                    return bot.sendMessage(chatId, 'Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
                }
                const ott = (0, uuid_1.v4)();
                await Redis_1.default.setex(`token:${ott}`, 600, troop.id);
                await bot.sendMessage(chatId, 'Silakan gunakan token di bawah ini untuk login ke dalam Aplikasi. klik pada token untuk copy text');
                setTimeout(() => {
                    bot.sendMessage(chatId, `\`${ott}\``, { parseMode: 'Markdown' });
                }, 100);
            }
            else if (text === 'help' || text === '/help') {
                bot.sendMessage(chatId, `Beberapa perintah yang bisa dilakukan untuk bot:
          
          /login - untuk mendapatkan token
          /check_id - untuk mendapatkan user_id anda
          /delete_akun - untuk menghapus akun

          Terima kasih.`);
            }
            else if (text === 'CHECK ID' || text === '/check_id') {
                bot.sendMessage(chatId, `ID anda adalah \`${chatId}\``, { parseMode: 'Markdown' });
            }
            else if (text === 'DELETE AKUN' || text === '/delete_akun') {
                let troop = await Database_1.default.from('troops').where('tg_id', chatId).first();
                if (troop) {
                    if (troop.blocked) {
                        return bot.sendMessage(chatId, 'Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
                    }
                    await Database_1.default.from('troops').where('tg_id', chatId).delete();
                }
                bot.sendMessage(chatId, `ID \`${chatId}\` telah dihapus`, { parseMode: 'Markdown' });
            }
        });
        bot.start();
        process.once('SIGINT', () => bot.stop());
        process.once('SIGTERM', () => bot.stop());
    }
}
exports.default = Telebot1;
Telebot1.commandName = 'telebot1';
Telebot1.description = 'Start Telegram bot';
Telebot1.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=Telebot1.js.map
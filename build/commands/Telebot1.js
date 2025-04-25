"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const telegraf_1 = require("telegraf");
const Redis_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Redis"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const uuid_1 = require("uuid");
class Telebot1 extends standalone_1.BaseCommand {
    async run() {
        const bot = new telegraf_1.Telegraf("5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk");
        bot.start((ctx) => {
            ctx.reply('Selamat datang di BOT OMOO. /help', {
                reply_markup: {
                    keyboard: [
                        ['LOGIN OMOO', 'LOGIN TS'],
                        ['CHECK ID', 'DELETE AKUN']
                    ]
                }
            });
        });
        bot.on('text', async (ctx) => {
            const chatId = ctx.message.chat.id;
            const text = ctx.message.text;
            if (text.toUpperCase() === 'LOGIN OMOO' || text.toUpperCase() === 'LOGIN TS' || text === '/login') {
                let troop = await Database_1.default.from('troops').where('tg_id', chatId).first();
                if (!troop) {
                    troop = {
                        tg_id: chatId,
                        name: ctx.message.chat.type === 'private' ? ctx.message.chat.first_name : ctx.message.chat.title,
                    };
                    try {
                        troop.id = await Database_1.default.table('troops').insert(troop);
                    }
                    catch (error) { }
                }
                else if (troop.blocked) {
                    return ctx.reply('Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
                }
                const ott = (0, uuid_1.v4)();
                await Redis_1.default.setex(`token:${ott}`, 600, troop.id);
                await ctx.reply('Silakan gunakan token di bawah ini untuk login ke dalam Aplikasi. klik pada token untuk copy text');
                setTimeout(() => {
                    ctx.replyWithMarkdownV2(`\`${ott}\``);
                }, 100);
            }
            else if (text === 'help' || text === '/help') {
                ctx.reply(`Beberapa perintah yang bisa dilakukan untuk bot:
          
          /login - untuk mendapatkan token
          /check_id - untuk mendapatkan user_id anda
          /delete_akun - untuk menghapus akun

          Terima kasih.`);
            }
            else if (text === 'CHECK ID' || text === '/check_id') {
                ctx.replyWithMarkdownV2(`ID anda adalah \`${chatId}\``);
            }
            else if (text === 'DELETE AKUN' || text === '/delete_akun') {
                let troop = await Database_1.default.from('troops').where('tg_id', chatId).first();
                if (troop) {
                    if (troop.blocked) {
                        return ctx.reply('Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
                    }
                    await Database_1.default.from('troops').where('tg_id', chatId).delete();
                }
                ctx.replyWithMarkdown(`ID \`${chatId}\` telah dihapus`);
            }
        });
        bot.launch();
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
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
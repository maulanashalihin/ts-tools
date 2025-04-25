"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const TeleBot = require("telebot");
const Bot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Bot"));
class Telebot1 extends standalone_1.BaseCommand {
    async run() {
        let bot;
        const TELEGRAM_BOT_TOKEN = "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk";
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
        new Bot_1.default(bot);
    }
}
exports.default = Telebot1;
Telebot1.commandName = "telebot1";
Telebot1.description = "";
Telebot1.settings = {
    loadApp: true,
    stayAlive: true,
};
//# sourceMappingURL=Telebot1.js.map
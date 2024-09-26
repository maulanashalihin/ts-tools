"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const TeleBot = require("telebot");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Bot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Bot"));
class Telebot1 extends standalone_1.BaseCommand {
    async run() {
        const TG_BOTKEY = Env_1.default.get("TG_BOTKEY", "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk");
        let bot;
        if (process.env.TG_PORT && process.env.TG_WEBHOOK_URL) {
            bot = new TeleBot({
                token: TG_BOTKEY,
                webhook: {
                    url: process.env.TG_WEBHOOK_URL,
                    host: "0.0.0.0",
                    port: process.env.TG_PORT,
                },
            });
        }
        else {
            console.log(TG_BOTKEY);
            bot = new TeleBot(TG_BOTKEY);
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
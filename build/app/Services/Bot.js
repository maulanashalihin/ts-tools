"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TG_TOKEN || '5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk';
const bot = new TelegramBot(token, { polling: true });
exports.default = bot;
//# sourceMappingURL=Bot.js.map
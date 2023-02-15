const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TG_TOKEN || '5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

export default bot;
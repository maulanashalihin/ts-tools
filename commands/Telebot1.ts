import { BaseCommand } from "@adonisjs/core/build/standalone"; 
const TeleBot = require("telebot");  
import Bot from "App/Services/Bot";

export default class Telebot1 extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = "telebot1";

  /**
   * Command description is displayed in the "help" output
   */
  public static description = "";

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: true,
  };

  public async run() {
   

    let bot;
const TELEGRAM_BOT_TOKEN = "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk"
    
    if (process.env.TG_PORT && process.env.TG_WEBHOOK_URL) {
      bot = new TeleBot({
          token: TELEGRAM_BOT_TOKEN,
          webhook: {
              // Optional. Use webhook instead of polling.
              url: process.env.TG_WEBHOOK_URL, // HTTPS url to send updates to.
              host: "0.0.0.0", // Webhook server host.
              port: process.env.TG_PORT, // Server port.
          },
      });
  } else {
      bot = new TeleBot(TELEGRAM_BOT_TOKEN);
      console.log("bot started")
  }

    new Bot(bot);


  }
}


// import { BaseCommand } from '@adonisjs/core/build/standalone'
// import Redis from "@ioc:Adonis/Addons/Redis"
// import Database from "@ioc:Adonis/Lucid/Database"
// import { v4 } from "uuid"
// const TeleBot = require('telebot')

// export default class Telebot1 extends BaseCommand {
//   public static commandName = 'telebot1'
//   public static description = 'Start Telegram bot'

//   public static settings = {
//     loadApp: true,
//     stayAlive: true,
//   }

//   public async run() {
//     const TELEGRAM_BOT_TOKEN = "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk"
    
//     let bot;

//     if (process.env.TG_PORT && process.env.TG_WEBHOOK_URL) {
//         bot = new TeleBot({
//             token: TELEGRAM_BOT_TOKEN,
//             webhook: {
//                 // Optional. Use webhook instead of polling.
//                 url: process.env.TG_WEBHOOK_URL, // HTTPS url to send updates to.
//                 host: "0.0.0.0", // Webhook server host.
//                 port: process.env.TG_PORT, // Server port.
//             },
//         });
//     } else {
//         bot = new TeleBot(TELEGRAM_BOT_TOKEN);
//         console.log("bot started")
//     }

//     // Handle /start command
//     bot.on('/start', (msg) => {
//       return bot.sendMessage(msg.from.id, 'Selamat datang di BOT OMOO. /help', {
//         replyMarkup: {
//           keyboard: [
//             ['LOGIN OMOO', 'LOGIN TS'],
//             ['CHECK ID', 'DELETE AKUN']
//           ],
//           resize: true
//         }
//       });
//     });

//     // Handle text messages
//     bot.on('text', async (msg) => {


//       const chatId = msg.from.id;
//       const text = msg.text;

//       if (text.toUpperCase() === 'LOGIN OMOO' || text.toUpperCase() === 'LOGIN TS' || text === '/login') {
//         let troop = await Database.from('troops').where('tg_id', chatId).first();

//         if (!troop) {
//           troop = {
//             tg_id: chatId,
//             name: msg.chat.type === 'private' ? msg.from.first_name : msg.chat.title,
//           };
//           try {
//             troop.id = await Database.table('troops').insert(troop);
//           } catch (error) {}
//         } else if (troop.blocked) {
//           return bot.sendMessage(chatId, 'Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
//         }

//         const ott = v4();
//         await Redis.setex(`token:${ott}`, 600, troop.id);

//         await bot.sendMessage(chatId, 'Silakan gunakan token di bawah ini untuk login ke dalam Aplikasi. klik pada token untuk copy text');
//         setTimeout(() => {
//           bot.sendMessage(chatId, `\`${ott}\``, { parseMode: 'Markdown' });
//         }, 100);
//       }

//       else if (text === 'help' || text === '/help') {
//         bot.sendMessage(chatId, `Beberapa perintah yang bisa dilakukan untuk bot:
          
//           /login - untuk mendapatkan token
//           /check_id - untuk mendapatkan user_id anda
//           /delete_akun - untuk menghapus akun

//           Terima kasih.`);
//       }

//       else if (text === 'CHECK ID' || text === '/check_id') {
//         bot.sendMessage(chatId, `ID anda adalah \`${chatId}\``, { parseMode: 'Markdown' });
//       }

//       else if (text === 'DELETE AKUN' || text === '/delete_akun') {
//         let troop = await Database.from('troops').where('tg_id', chatId).first();

//         if (troop) {
//           if (troop.blocked) {
//             return bot.sendMessage(chatId, 'Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock');
//           }
//           await Database.from('troops').where('tg_id', chatId).delete();
//         }
//         bot.sendMessage(chatId, `ID \`${chatId}\` telah dihapus`, { parseMode: 'Markdown' });
//       }
//     });

//     // Start the bot
//     bot.start();

//     // Handle graceful shutdown
//     process.once('SIGINT', () => bot.stop());
//     process.once('SIGTERM', () => bot.stop())
//   }
// }


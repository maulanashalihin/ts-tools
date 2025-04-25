import Redis from "@ioc:Adonis/Addons/Redis";
import Database from "@ioc:Adonis/Lucid/Database";
import { v4 } from "uuid";
import Logger from "@ioc:Adonis/Core/Logger";

export default class Bot {
  private bot: any;

  constructor(bot) {
    this.bot = bot;
    
    // Add error event handler for the bot
    bot.on('error', (error) => {
      Logger.error(`Telegram bot error: ${error.message}`);
      console.error('Telegram bot error:', error);
    });

    bot.on("text", async (msg) => {
      const chatId = msg.chat.id;
      console.log(msg)

      if (
        msg.text.toUpperCase() == "LOGIN OMOO" ||
        msg.text.toUpperCase() == "LOGIN TS" ||
        "/login" == msg.text
      ) {
        let troop = await Database.from("troops")
          .where("tg_id", chatId)
          .first();

        if (!troop) {
          troop = {
            tg_id: chatId,
            name: msg.chat.first_name,
          };
          try {
            troop.id = await Database.table("troops").insert(troop);
          } catch (error) {}
        } else {
          if (troop.blocked) {
            this.sendMessage(
              chatId,
              "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock"
            );

            return;
          }
        }

        const ott = v4();

        await Redis.setex(`token:` + ott, 600, troop.id);

        this.sendMessage(
          chatId,
          "Silakan gunakan token di bawah ini  untuk login ke dalam Aplikasi. klik pada token untuk copy text"
        );

        setTimeout(() => {
          this.sendMessage(chatId, "`" + ott + "`", { 
            parseMode: "MarkDown",
            reply_markup: this.getMainKeyboard()
          });
        }, 100);
      }

     else if (msg.text == "/help") {
        this.sendMessage(
          chatId,
          `Beberapa perintah yang bisa dilakukan untuk bot :
            
                /login - untuk mendapatkan token
                /check_id - untuk mendapatkan user_id anda
                /delete_akun - untuk menghapus akun
          
                Terima kasih.`,
          {
            reply_markup: this.getMainKeyboard()
          }
        );
      }

      else if (msg.text == "CHECK ID" || msg.text == "/check_id") {
        this.sendMessage(chatId, "ID anda adalah `" + chatId + "`", {
          parseMode: "MarkDown",
          reply_markup: this.getMainKeyboard()
        });
      }

      else if (msg.text == "DELETE AKUN" || msg.text == "/delete_akun") {
        let troop = await Database.from("troops")
          .where("tg_id", chatId)
          .first();

        if (troop) {
          if (troop.blocked) {
            this.sendMessage(
              chatId,
              "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock"
            );

            return;
          }

          await Database.from("troops").where("tg_id", chatId).delete();
        }

        this.sendMessage(chatId, "ID `" + chatId + "` telah dihapus", {
          parseMode: "MarkDown",
          reply_markup: this.getMainKeyboard()
        });
      }else{

        this.sendMessage(chatId, "Selamat datang di BOT OMOO. /help", {
            reply_markup: this.getMainKeyboard()
          });
          
      }

     
    });

    bot.start();
  }

  /**
   * Send a message with error handling
   * @param chatId The chat ID to send the message to
   * @param text The message text
   * @param options Optional message options
   * @returns Promise that resolves with the sent message or rejects with an error
   */
  public async sendMessage(chatId: number | string, text: string, options: any = {}) {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      Logger.error(`Failed to send message to ${chatId}: ${error.message}`);
      console.error(`Failed to send message to ${chatId}:`, error);
      
      // You can implement retry logic here if needed
      // For example:
      // try {
      //   await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      //   return await this.bot.sendMessage(chatId, text, options);
      // } catch (retryError) {
      //   Logger.error(`Retry failed: ${retryError.message}`);
      //   throw retryError;
      // }
      
      throw error; // Re-throw the error for the caller to handle if needed
    }
  }

  /**
   * Send a photo with error handling
   * @param chatId The chat ID to send the photo to
   * @param photo The photo to send (file_id, URL, or file path)
   * @param options Optional photo options
   * @returns Promise that resolves with the sent message or rejects with an error
   */
  public async sendPhoto(chatId: number | string, photo: string, options: any = {}) {
    try {
      return await this.bot.sendPhoto(chatId, photo, options);
    } catch (error) {
      Logger.error(`Failed to send photo to ${chatId}: ${error.message}`);
      console.error(`Failed to send photo to ${chatId}:`, error);
      throw error;
    }
  }

  /**
   * Send a document with error handling
   * @param chatId The chat ID to send the document to
   * @param document The document to send (file_id, URL, or file path)
   * @param options Optional document options
   * @returns Promise that resolves with the sent message or rejects with an error
   */
  public async sendDocument(chatId: number | string, document: string, options: any = {}) {
    try {
      return await this.bot.sendDocument(chatId, document, options);
    } catch (error) {
      Logger.error(`Failed to send document to ${chatId}: ${error.message}`);
      console.error(`Failed to send document to ${chatId}:`, error);
      throw error;
    }
  }

  /**
   * Get the main keyboard markup for common actions
   * @returns Keyboard markup object for Telegram
   */
  private getMainKeyboard() {
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

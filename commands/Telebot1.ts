

import { BaseCommand } from '@adonisjs/core/build/standalone'
import { Telegraf } from 'telegraf'
import Redis from "@ioc:Adonis/Addons/Redis"
import Database from "@ioc:Adonis/Lucid/Database"
import { v4 } from "uuid"

export default class Telebot1 extends BaseCommand {
  public static commandName = 'telebot1'
  public static description = 'Start Telegram bot'

  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  public async run() {
    const bot = new Telegraf("5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk")

    bot.start((ctx) => {
      ctx.reply('Selamat datang di BOT OMOO. /help', {
        reply_markup: {
          keyboard: [
            ['LOGIN OMOO', 'LOGIN TS'],
            ['CHECK ID', 'DELETE AKUN']
          ]
        }
      })
    })

    bot.on('text', async (ctx) => {
      const chatId = ctx.message.chat.id
      const text = ctx.message.text

      if (text.toUpperCase() === 'LOGIN OMOO' || text.toUpperCase() === 'LOGIN TS' || text === '/login') {
        let troop = await Database.from('troops').where('tg_id', chatId).first()

        if (!troop) {
          troop = {
            tg_id: chatId,
            name: ctx.message.chat.type === 'private' ? ctx.message.chat.first_name : ctx.message.chat.title,
          }
          try {
            troop.id = await Database.table('troops').insert(troop)
          } catch (error) {}
        } else if (troop.blocked) {
          return ctx.reply('Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock')
        }

        const ott = v4()
        await Redis.setex(`token:${ott}`, 600, troop.id)

        await ctx.reply('Silakan gunakan token di bawah ini untuk login ke dalam Aplikasi. klik pada token untuk copy text')
        setTimeout(() => {
          ctx.replyWithMarkdownV2(`\`${ott}\``)
        }, 100)
      }

      else if (text === 'help' || text === '/help') {
        ctx.reply(`Beberapa perintah yang bisa dilakukan untuk bot:
          
          /login - untuk mendapatkan token
          /check_id - untuk mendapatkan user_id anda
          /delete_akun - untuk menghapus akun

          Terima kasih.`)
      }

      else if (text === 'CHECK ID' || text === '/check_id') {
        ctx.replyWithMarkdownV2(`ID anda adalah \`${chatId}\``)
      }

      else if (text === 'DELETE AKUN' || text === '/delete_akun') {
        let troop = await Database.from('troops').where('tg_id', chatId).first()

        if (troop) {
          if (troop.blocked) {
            return ctx.reply('Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock')
          }
          await Database.from('troops').where('tg_id', chatId).delete()
        }
        ctx.replyWithMarkdown(`ID \`${chatId}\` telah dihapus`)
      }
    })

    bot.launch()
    

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  }
}
import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Database.table("messages").insert({
      id : "otp",
      text : `
Anda melakukan Request OTP untuk login ke dalam Aplikasi,

Jika benar silakan klik tombol berikut
      `,
      buttons : JSON.stringify(["Request OTP", "Bukan Saya"])
    })

    await Database.table("messages").insert({
      id : "join",
      text : `
Alhamdulillah, anda telah bergabung dalam campaign [title]

Campaign akan mulai pada [time]

Semoga Allah SWT membalas amal dan kebaikan kita. Trending Yuk! Gasken!
      `,
      buttons : JSON.stringify(["Aameen"])
    })

    await Database.table("messages").insert({
      id : "next_round_reminder",
      text : `
Saat ini round [current_round] telah dimulai

Yuk kembali masuk aplikasi dan melakukan ACTION yang sudah diakadkan.
`,
buttons : JSON.stringify(["Siap, Lanjut!"])
    })

    await Database.table("api_keys").insert({
      id : "f36a5bb2-ccc6-4423-b5e4-96db6677e80a"
    })
  }
}

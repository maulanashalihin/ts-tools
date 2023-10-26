import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database' 

export default class UnblocksController {
  public async index({inertia}: HttpContextContract) {

    const unblocks = await Database.from("request_unblocks").where("status","pending").orderBy("id","desc")

    return inertia.render("request-unblock-admin",{unblocks})

  }

  public async create({inertia}: HttpContextContract) {

    return inertia.render("request-unblock")

  }

  public async store({request,inertia}: HttpContextContract) {

    let data = request.all() 
    data.created_at = Date.now()
    data.updated_at = Date.now()

    await Database.table("request_unblocks").insert(data);


    const msg = {
        tg_id : data.tg_id,
        text : `Terima kasih. kami akan segera mereview akun anda. tunggu kabar dari kami selanjutnya.`
      }

      await Redis.sadd("queue:riayah",JSON.stringify(msg))


    return inertia.render("request-unblock-success")
    
  }

  public async show({inertia}: HttpContextContract) {


    return inertia.render("request-unblock-success")

  }

  public async edit({}: HttpContextContract) {}

  public async update({params,request}: HttpContextContract) {

    
    if(request.input("status") == 'approved')
    {
      const msg = {
        tg_id : request.input("tg_id"),
        text : `Alhamdulillah. akun anda telah dipulihkan kembali.`
      }

      await Database.from("troops").where("tg_id",request.input("tg_id")).update({
        blocked : false,
        pin_hash : null,
        pin_set : false
      })

      await Redis.sadd("queue:riayah",JSON.stringify(msg))

    }else if(request.input("status") == 'rejected')
    {
      const msg = {
        tg_id : request.input("tg_id"),
        text : `Maaf. Pengajuan Cabut Blokir ditolak.
        
        Alasan : ${request.input("rejected_reason")}`
      }

      await Redis.sadd("queue:riayah",JSON.stringify(msg))
    }
    
    await Database.from("request_unblocks").where("id",params.id).update({
      status : request.input("status"),
      rejected_reason : request.input("rejected_reason")
    })

  }

  public async destroy({}: HttpContextContract) {}
}

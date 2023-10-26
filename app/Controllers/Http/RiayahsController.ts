import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RiayahsController {
  public async index({inertia}: HttpContextContract) {

    const campaigns = await Database.from("riayahs").orderBy("id","desc").limit(10);

    
    return inertia.render("riayah",{campaigns})
  }

  public async create({inertia}: HttpContextContract) { 
    return inertia.render("riayah-create")

  }

  public async store({request,response}: HttpContextContract) {
    
    await Database.table("riayahs").insert(request.all())

    return response.redirect("/riayah")

  }

  public async show({}: HttpContextContract) {}

  public async edit({inertia,params}: HttpContextContract) {

    let campaign = await Database.from("riayahs").where("id",params.id).first()
 

    return inertia.render("riayah-create",{campaign})
  }

  public async update({request,response,params}: HttpContextContract) {
    
    let data = request.except(['id']);
 

    await Database.from("riayahs").where("id",params.id).update(data)

    return response.redirect("/riayah",false,303)

  }

  public async destroy({}: HttpContextContract) {}

  public async upload({request}: HttpContextContract) {

    const coverImage = request.file('file', {
      size: '20mb',
      extnames: ['jpg', 'png', 'gif','mp4','jpeg','pdf','doc','docx','ppt','pptx','xls','xlsx'],
    })


  if (!coverImage) {
    return
  }
  
  if (!coverImage.isValid) {
    return coverImage.errors
  }
  

  if (coverImage) {

    await coverImage.moveToDisk("./")
    // Get the name of the saved file; to store it in your database, for example.
 

    return coverImage.fileName;

   
  }

    
  }

  
}

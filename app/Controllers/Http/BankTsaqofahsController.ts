import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { MeiliSearch } from 'meilisearch'

export default class BankTsaqofahsController {

  

  public async indexOmoo({auth}: HttpContextContract) {

    const user = auth.use("api").user;

    if(user)
    {
      return await Database.from("bank_tsaqofahs").where("status","published").orderBy("id","desc").limit(20);
    }


    
  }

  public async showOmoo({auth,params}: HttpContextContract) {

    const user = auth.use("api").user;

    if(user)
    {
      return await Database.from("bank_tsaqofahs").where("status","published").where("id",params.id).first();
    }


    
  }

  

  public async index({inertia,auth}: HttpContextContract) {

    const user = auth.use("buzzer").user;

    if(user)
    { 
      const tsaqofah = await Database.from("bank_tsaqofahs").where("contributor",user.id);

      return inertia.render("bank-tsaqofah",{tsaqofah})
    }
  }

  public async indexAdmin({inertia,auth}: HttpContextContract) {

    const user = auth.use("web").user;

    if(user)
    { 
      const tsaqofah = await Database.from("bank_tsaqofahs").orderBy("id","desc").limit(20);

      return inertia.render("bank-tsaqofah-admin",{tsaqofah})
    }
  }

  public async create({auth,inertia}: HttpContextContract) {
    const user = auth.use("buzzer").user;

    if(user)
    {  

      return inertia.render("bank-tsaqofah-upload")
    }
  }

  public async store({request,auth,response}: HttpContextContract) {
    const user = auth.use("buzzer").user;

    if(user)
    {  
      let data = request.all();
      
      data.contributor = user.id;
      
      data.status = "in review";
      
      await Database.table("bank_tsaqofahs").insert(data)

      return response.redirect("/bank-tsaqofah")
    }
  }

  public async show({auth,inertia,params}: HttpContextContract) {
    const user = auth.use("web").user;

    if(user)
    { 
      const content = await Database.from("bank_tsaqofahs").where("id",params.id).first()


      return inertia.render("bank-tsaqofah-review",{content})
    }

  }

  public async edit({auth,params,inertia}: HttpContextContract) {
    const user = auth.use("buzzer").user;

    if(user)
    {   
      
      const content = await Database.from("bank_tsaqofahs").where("id",params.id).first()

      if(content.contributor == user.id)
      {
        return inertia.render("bank-tsaqofah-upload",{content})
      }

      
    }
  }

  public async update({}: HttpContextContract) {}

  public async status({auth,params,request}: HttpContextContract) {
    const user = auth.use("web").user;
 
    if(user)
    {
      const tsaqofah = await Database.from("bank_tsaqofahs").where("id",params.id).first();

      
      await Database.from("bank_tsaqofahs").where("id",params.id).update({status : request.input("status")})


      const client = new MeiliSearch({
        host: 'https://ms-095276b6e275-1655.sgp.meilisearch.io',
        apiKey: '776a10df2bd5c1f6f4197f0561b72afe06d5a081',
      })
    
      // An index is where the documents are stored.
      const index = client.index('tsaqofah')

       await index.addDocuments(tsaqofah)


      return "OK"
    }
  }

  public async destroy({}: HttpContextContract) {}
}

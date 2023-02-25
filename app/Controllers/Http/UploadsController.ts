import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext' 

const sharp = require('sharp');
import {v4} from "uuid";  
const fs = require('fs')  
 import Drive from '@ioc:Adonis/Core/Drive'

export default class UploadsController {


    public async store({request}: HttpContextContract) {
 

    
         
    let extnames = ['jpg','jpeg', 'png', 'gif'];
    let size = '15mb'
 
    if(request.header('Filetype') == 'video')
    {
      extnames = ['mp4']
      size = '100mb'
    } else if(request.header('Filetype') == 'pdf')
    { 
      extnames = ['pdf']
      size = '20mb'
    }else if(request.header('Filetype') == 'file')
    { 
      extnames = ['pdf','doc','docx','ppt','pptx','xls','xlsx','jpg','jpeg', 'png']
      size = '20mb'
    } 

    


  
    const coverImage = request.file('file', {
      size: size,
      extnames: extnames,
    })
 
 
    
    if (!coverImage) {
      return
    }
    
    if (!coverImage.isValid) {
      return coverImage.errors
    }
     

    if (coverImage) {

        const filename = request.input("uuid",v4())+"."+coverImage.extname;
 
        const folder = request.input("folder","omoo");
     
       if(coverImage.type == 'image')
      { 

        const buffer =   await sharp(coverImage.tmpPath).resize(500).toBuffer();
 
     

        await Drive.put( folder+"/"+filename, buffer) 

        return `https://indotoko.ap-south-1.linodeobjects.com/${folder}/${filename}` 
      
      }else{
 
        // params.Body = coverImage.tmpPath;
        const stream = fs.createReadStream(coverImage.tmpPath) 
  
        await Drive.put( folder+"/"+filename, stream) 

        return `https://indotoko.ap-south-1.linodeobjects.com/${folder}/${filename}` 

      } 
      // Get the name of the saved file; to store it in your database, for example.
      
     
      
     
    }


    return "ok"
    }
 
}

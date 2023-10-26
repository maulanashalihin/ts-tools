import id from "./id.json"
import en from "./en.json"

export function t(key)
{
    let lang = localStorage.getItem("lang")

    if(!lang)
    {
        lang = window.default_lang || 'id';
    }

    localStorage.setItem("lang",lang)



    if(lang == 'id')
    {
        id[key] = key;

        localStorage.setItem("id_lang",JSON.stringify(id))
        
        return id[key] || key;
    }

    if(lang == 'en')
    {
        return en[key] || key;
    }
}
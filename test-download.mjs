import axios from "axios" 
axios({
    method: 'get',
    url: "https://indotoko.ap-south-1.linodeobjects.com/omoo/a3e0e276-a655-4edc-9575-3954cbd9176b.mp4",
    responseType: 'blob'
  }).then(response=>{
    console.log(response.data)
  })
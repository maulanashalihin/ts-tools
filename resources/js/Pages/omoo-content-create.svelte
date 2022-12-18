<script>
	import { inertia } from '@inertiajs/inertia-svelte';
    import { Inertia } from "@inertiajs/inertia";
  import axios from "axios";
    import dayjs from "dayjs"
    import { onMount } from 'svelte';
    
import Layouts from './../Components/ts-layouts.svelte';
 

export let channel;

export let content = {
    channel_id : channel.id, 
    channel_name : channel.name,
    channel_avatar : channel.avatar,
    type : "text",
    caption : "",
    created : Date.now()
}

 
function saveContent()
{
    if(channel.official)
    {
      content.category = "Official"
      content.status = "approved"
    }
   if(content.id)
   {
    Inertia.put(`/channel/${channel.id}/content/${content.id}`,content)
   }else{
    Inertia.post(`/channel/${channel.id}/content`,content)
   }
}

let uploadProgress = 0;

function handleChange(e)
{
   const file = e.target.files[0];

    var formData = new FormData();

        let type = file.type.split("/")[0];
        
        formData.append("file", file);
  
         let url = '/upload';
        
          axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Filetype' : type
            },
            onUploadProgress: (progressEvent) => {
  
              uploadProgress = Math.floor(progressEvent.loaded / progressEvent.total * 100) 
            }
          }).then(response => {
  
              uploadProgress = 0;
  
              if(typeof response.data == 'string')
              {
                if(type == 'image')
                {
                    content.images_url = response.data;
                    content.type = type
                } 
                if(type == 'video')
                {
                    content.video_url = response.data;
                    content.type = type
                }   
                console.log(content.type)
  
              } 
              
          })
}

    </script>
    <Layouts>
        <!-- Page Heading -->
        <div class="bg-white">
            <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              <div class=" text-center">
                <div>
                 <div class="flex justify-center">
                  <img class="w-16 h-16 rounded-full" src="{channel.avatar}" alt="">
                 </div>
                  <div class="text-2xl mt-3">{channel.name}</div>
                </div>
              </div>
               
            </div>
          </div>
          <!-- END Page Heading -->
      
          <!-- Page Section -->
          <div class="container max-w-xl mx-auto p-4 lg:p-8">
               <!-- svelte-ignore a11y-click-events-have-key-events -->
               {#if content.type == 'text' && uploadProgress == 0}
               <div on:click={()=>{document.querySelector('#uploader').click()}} class="border-4 cursor-pointer border-dashed p-6 flex justify-center">
                <div>
                  <div class="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                  </div>
                      <div class="text-center mt-3">
                        Upload Gambar/Video
                      </div>
                      
                </div>

           </div>
               {/if}
               {#if uploadProgress}
                <!-- Progress Bar: Stacked With Heading -->
<div class="space-y-1">
  <h3 class="font-semibold">
    Upload Progress
  </h3>
  <div class="flex items-center w-full h-5 bg-teal-100 rounded-lg overflow-hidden">
    <div
      role="progressbar"
      aria-valuenow="{uploadProgress}"
      aria-valuemin="0"
      aria-valuemax="100"
      class="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-teal-500 text-white text-sm font-semibold"
      style="width: {uploadProgress}%;"
    >
      {uploadProgress}%
    </div>
  </div>
</div>
<!-- END Progress Bar: Stacked With Heading -->
               {/if}
               <input type="file" accept="image/png, image/jpeg, video/*" id="uploader" on:change="{handleChange}" class="hidden">

               {#if content.type == 'image'}
                <img src="{content.images_url}" class="w-full" alt="Content of Images" />
               {/if}
              
               <form on:submit|preventDefault={saveContent}  >
                <div class="mt-6">
                  <label class="font-medium" for="caption">Caption</label>
                  <textarea bind:value="{content.caption}" class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="caption" rows="4" placeholder="Description of the post"></textarea>
                </div>
                {#if channel.official == false}
                <div class="mt-4">
                  <label class="font-medium" for="tk-inputs-default-select">Kategori</label>
                 
                  <select bind:value="{content.category}"  class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="tk-inputs-default-select">
                    <option>Politik</option>
                    <option>Ekonomi</option>
                    <option>Ulama</option>
                    <option>Muslimah</option>
                    <option>Mahasiswa</option>  
                  </select>
                </div>
                {/if}
                <div class="mt-4">
                    <button class="w-full bg-orange-500 text-white py-2">Simpan</button>
                </div>
                <div class="text-center text-sm mt-3 text-gray-500">
                  <a use:inertia href="/channel/{channel.id}">Kembali</a>
                </div>
             </form>
                <!-- END Textarea --> 
       
          </div> 
    </Layouts>
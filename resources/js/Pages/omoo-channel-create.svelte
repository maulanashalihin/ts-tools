<script>
    import { Inertia } from "@inertiajs/inertia";
  import axios from "axios";
    import dayjs from "dayjs"
    import { onMount } from 'svelte';
    
import Layouts from './../Components/ts-layouts.svelte';

export let channel = {
    avatar : "https://avatars.dicebear.com/api/initials/NN.svg",
    name : "",
    created : Date.now()
}

function changeAvatar()
{
    if(channel.avatar.includes("avatars"))
    {
        channel.avatar = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(channel.name)}.svg`
    }
}

function saveChannel()
{
    if(channel.id)
    {
      Inertia.put("/channel/"+channel.id,channel)
    }else{
      Inertia.post("/channel",channel)
    }
}

let uploadProgress = 0;

function handleChange(e)
{
   const file = e.target.files[0];

    var formData = new FormData();
        
        formData.append("file", file);
  
         let url = '/upload';
        
          axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Filetype' : "avatar"
            },
            onUploadProgress: (progressEvent) => {
  
              uploadProgress = Math.floor(progressEvent.loaded / progressEvent.total * 100) 
            }
          }).then(response => {
  
              uploadProgress = 0;
  
              if(typeof response.data == 'string')
              {
                channel.avatar = response.data   
  
              } 
              
          })
}

    </script>
    <Layouts>
        <!-- Page Heading -->
        <div class="bg-white">
            <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              <div class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0">
                <div class="grow">
                  <h1 class="text-xl font-bold text-gray-700 mb-1">
                    {#if channel.id}
                      {channel.name}
                    {:else}
                    Buat Channel Baru
                    {/if}
                  </h1>
                  
                </div>
                
              </div>
            </div>
          </div>
          <!-- END Page Heading -->
      
          <!-- Page Section -->
          <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              
   
  
              <div class="space-y-8">
                <!-- User Profile -->
                <div class="md:flex md:space-x-5">
                  <!-- User Profile Info -->
                  <div class="md:flex-none md:w-1/3 text-center md:text-left">
                    <h3 class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
                      <svg class="hi-solid hi-user-circle inline-block w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>
                      <span>Channel</span>
                    </h3>
                    <p class="text-gray-500 text-sm mb-5">
                      Detail Channel Anda
                    </p>
                  </div>
                  <!-- END User Profile Info -->
              
                  <!-- Card: User Profile -->
                  <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
                    <!-- Card Body: User Profile -->
                    <div class="p-5 lg:p-6 grow w-full">
                      <form on:submit|preventDefault={saveChannel}  enctype="multipart/form-data" class="space-y-6">
                         
                        <div class="space-y-1">
                            <label for="avatar" class="font-medium">Photo</label>
                            <div class="sm:flex sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300">
                                <img class="rounded-full" src="{channel.avatar}" alt="">
                              </div>
                              <label class="block">
                                <span class="sr-only">Choose profile photo</span>
                                <input on:change={handleChange} class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" type="file" id="photo" name="photo" />
                              </label>
                            </div>
                          </div>
                           
                          <div class="space-y-1">
                            <label for="name" class="font-medium">Nama Channel</label>
                            <input on:keyup={changeAvatar} bind:value={channel.name} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="name" placeholder="Dakwah Islam" />
                          </div> 
                          <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                            Simpan
                          </button>
                      </form>
                    </div>
                    <!-- Card Body: User Profile -->
                  </div>
                  <!-- Card: User Profile -->
                </div>
                <!-- END User Profile -->
              
               
                   
              </div>
       
          </div> 
    </Layouts>
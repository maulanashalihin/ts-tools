<script>
  import { Inertia } from "@inertiajs/inertia";
  import dayjs from "dayjs"
  import { onMount } from 'svelte';

    const { default: Layouts } = require("../Components/layouts.svelte");
    export let campaign = {
      description : '', 
      hashtag_per_tweet : 1,
      tweet_per_round : 10,
      tweet_love_and_retweet_per_round : 5,
      tweet_reply_per_round : 5,
      follow_profile_per_round : 5,
      status : "tweet submission"
    }

    if(campaign.time)
    {
      campaign.campaign_time = dayjs(campaign.time).format("YYYY-MM-DDTHH:mm")
    }

    if(campaign.end_time)
    {
      campaign.end_time_string = dayjs(campaign.end_time).format("YYYY-MM-DDTHH:mm")
    }

    

    let quill;

    function saveCampaign()
    {
 
       campaign.description = quill.root.innerHTML;

      campaign.time = dayjs(campaign.campaign_time).valueOf()
      campaign.end_time = dayjs(campaign.end_time_string).valueOf()
     if(campaign.id)
     {
      Inertia.put("/campaign/"+campaign.id,campaign)
     }else
     {
      Inertia.post("/campaign",campaign)
     }
    }

    var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
 
    onMount(()=>{
      quill = new Quill('#description', {
        modules: {
    toolbar: toolbarOptions
  },
        theme: 'snow'   // Specify theme in configuration
      });
    })

    let timezone = "WIB"

const offset = new Date().getTimezoneOffset();

if(offset == -480)
{
  timezone = "WITA"
}

if(offset == -540)
{
  timezone = "WIT"
}


function deleteCampaign()
{
  let check = window.confirm("Apakah yakin mau menghapus campaign ini?")
  if(check)
  {
    Inertia.delete("/campaign/"+campaign.id)
  }
}
  

  </script>
  <Layouts>
      <!-- Page Heading -->
      <div class="bg-white">
          <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
            <div class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0">
              <div class="grow">
                <h1 class="text-xl font-bold text-gray-700 mb-1">
                  Buat Campaign Baru
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
                    <span>Tema Campaign</span>
                  </h3>
                  <p class="text-gray-500 text-sm mb-5">
                    Info utama mengenai campaign yang mau diangkat
                  </p>
                </div>
                <!-- END User Profile Info -->
            
                <!-- Card: User Profile -->
                <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
                  <!-- Card Body: User Profile -->
                  <div class="p-5 lg:p-6 grow w-full">
                    <form on:submit|preventDefault={saveCampaign}  enctype="multipart/form-data" class="space-y-6">
                       
                      <div class="space-y-1">
                        <label for="title" class="font-medium">Judul Campaign</label>
                        <input bind:value={campaign.title} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="title" placeholder="Kontra Isu Anti Khilafah" required />
                      </div>
                      <div class="space-y-1">
                        <label class="font-medium" for="description">Latar Belakang Campaign</label>
                        <div id="description">
                            {@html campaign.description}
                        </div>
                        <!-- <textarea  bind:value={campaign.description} class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="description" rows="4" placeholder="motivasi mengapa campaign ini penting"></textarea> -->
                        <div><small class="text-gray-400">jelaskan mengapa campaign ini dilakukan</small></div>
                      </div>
                      <div class="space-y-1">
                        <label for="hashtag" class="font-medium">Hashtag</label>
                        <input bind:value={campaign.hashtags} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="hashtag" placeholder="Khilafah Ajaran Islam, Jayalah Khilafah"  required/>
                        <div><small class="text-gray-400">pisahkan dengan koma</small></div>
                      </div>
                      <div class="space-y-1">
                        <label for="hashtag_per_tweet" class="font-medium">Jumlah Hashtag per tweet</label>
                        <input bind:value={campaign.hashtag_per_tweet} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="number" id="hashtag_per_tweet" placeholder="1"  required/>
                        <div><small class="text-gray-400">jumlah hashtag yang ditampilkan dalam 1 konten tweet</small></div>
                      </div>
                      
                      <div class="space-y-1">
                        <label  for="hashtag" class="font-medium">Waktu Campaign Mulai</label>
                        <input bind:value={campaign.campaign_time} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="datetime-local" id="hashtag" placeholder="Khilafah Ajaran Islam, Jayalah Khilafah" required/>
                        <small class="text-gray-400">waktu dalam {timezone}</small>
                      </div>
                      <div class="space-y-1">
                        <label  for="hashtag" class="font-medium">Waktu Campaign Berakhir</label>
                        <input bind:value={campaign.end_time_string} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="datetime-local" id="hashtag" placeholder="Khilafah Ajaran Islam, Jayalah Khilafah" required/>
                        <small class="text-gray-400">waktu dalam {timezone}</small>
                      </div>
                      <div class="space-y-1">
                        <label class="font-medium" for="status">Status</label>
                        <select bind:value="{campaign.status}" class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="status">
                          <option value="tweet submission">Tweet Submission</option>
                          <option value="waiting">Menunggu Campaign</option> 
                          <option value="running">Campaign Berjalan</option> 
                          <option value="done">Campaign Selesai</option> 
                        </select>
                      </div>
                       
                      <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                        Simpan Campaign
                      </button>
                    </form>
                  </div>
                  <!-- Card Body: User Profile -->
                </div>
                <!-- Card: User Profile -->
              </div>
              <!-- END User Profile -->
            
             
              <!-- Billing Information -->
              <div class="md:flex md:space-x-5">
                <!-- Billing Information Info -->
                <div class="md:flex-none md:w-1/3 text-center md:text-left">
                  <h3 class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hi-solid hi-credit-card inline-block w-5 h-5 text-indigo-500" >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                    
                    <span>Pengaturan Tambahan</span>
                  </h3>
                  <p class="text-gray-500 text-sm mb-5">
                    Tambahan pengaturan untuk campaign
                  </p>
                </div>
                <!-- END Billing Information Info -->
            
                <!-- Card: Billing Information -->
                <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
                  <!-- Card Body: Billing Information -->
                  <div class="p-5 lg:p-6 grow w-full">
                    <form on:submit|preventDefault={saveCampaign}   class="space-y-6">
                      
                      <div class="grid gap-6 lg:grid-cols-2">
                        <div class="space-y-1 grow">
                          <label for="tweet_per_round" class="font-medium">Tweet per round</label>
                          <input bind:value="{campaign.tweet_per_round}" class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="number" id="tweet_per_round" />
                        </div>
                        <div class="space-y-1 grow">
                          <label for="tweet_love_and_retweet_per_round" class="font-medium">Like and Retweet per round</label>
                          <input bind:value="{campaign.tweet_love_and_retweet_per_round}" class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="number" id="tweet_love_and_retweet_per_round" />
                        </div>
                        <div class="space-y-1 grow">
                          <label for="tweet_reply_per_round" class="font-medium">Reply per round</label>
                          <input bind:value="{campaign.tweet_reply_per_round}" class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="number" id="tweet_reply_per_round" />
                        </div>
                        <div class="space-y-1 grow">
                          <label for="follow_profile_per_round" class="font-medium">Follow per round</label>
                          <input bind:value="{campaign.follow_profile_per_round}" class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="number" id="follow_profile_per_round" />
                        </div>
                        
                      </div>
                       
                      <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                        Simpan Campaign
                      </button>
                    </form>
                  </div>
                  <!-- END Card Body: Billing Information -->
                </div>
                <!-- END Card: Billing Information -->
              </div>
              <!-- END Billing Information -->
            
              <!-- Notifications -->
               
              <!-- Form Action with Button -->
              {#if campaign.id}
              <div class="flex flex-row-reverse ">
                <form on:submit|preventDefault={deleteCampaign} class="md:w-2/3 ">
                  <!-- Card -->
                  <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                    <!-- Card Body -->
                    <div class="p-5 lg:p-6 grow w-full border-l-4 border-red-300">
                      <h3 class="text-lg font-semibold mb-1">
                        Campaign Deletion
                      </h3>
                      <p class="text-gray-500 mb-4">
                        Are you sure you would like to delete this campaign? Please be careful since this action cannot be undone!
                      </p>
                      <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-red-200 bg-red-200 text-red-700 hover:text-red-700 hover:bg-red-300 hover:border-red-300 focus:ring focus:ring-red-500 focus:ring-opacity-50 active:bg-red-200">
                        Delete Campaign
                      </button> 
                    </div>
                    <!-- END Card Body -->
                  </div>
                  <!-- END Card -->
                </form>
              </div>
              {/if}
              <!-- END Form Action with Button -->

              <!-- END Notifications -->
            </div>
     
        </div> 
  </Layouts>
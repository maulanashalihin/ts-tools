<script>
    	import dayjs from 'dayjs';
	import { inertia,Link } from '@inertiajs/inertia-svelte';  
  export let campaigns = [];
    import axios from "axios"
    import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/ts-layouts.svelte';
  import { Inertia } from '@inertiajs/inertia';
    export let user; 

    let profileModal = false;
    
    if(!user.twitter_username)
    {
        profileModal = true;
    }
    function saveProfile()
    {
        axios.post("/buzzer",user)
        profileModal = false;
        Inertia.reload()
    }
</script>
<div>
    <TsLayouts>

        <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
            <!--
      
            ADD YOUR MAIN CONTENT BELOW
      
            -->
      
            
            {#if campaigns.length}
            <div class="grid lg:grid-cols-3">
              {#each campaigns as item}
                 <!-- content here -->
                 <Link href="/c/{item.id}"  class="rounded-lg bg-white  justify-between p-4 sm:p-5">
                  <div class="flex items-center space-x-4"> 
                    <div>
                      <h3 class="text-lg font-medium text-slate-700 dark:text-navy-100">
                        {item.title}
                      </h3> 
                    </div>
                  </div>
                  <div class="mt-4">
                    <p class="text-xs+">{dayjs(item.time).format("DD MMM YYYY")}</p>
                    <p class="text-xl font-medium text-slate-700 dark:text-navy-100">
                      {dayjs(item.time).format("HH:mm")}
                    </p>
                    <div class="text-md">
                      {item.hashtags}
                    </div>
                    <div class="mt-5 flex items-center justify-between space-x-2">
                      <div class="flex -space-x-3 text-sm">
                      {#if item.status == 'running'}
                      diikuti oleh {item.attendee || 0} orang
                      {:else if (item.status == 'tweet submission')}
                      <div class="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100">
                        Yuk kontribusi memberikan kata-kata hebat anda agar TS kali ini bisa viral dan mengguncang dunia.
                      </div>
                      {/if}
                      </div>
                    
                     
                    </div>
                  </div>
                </Link>
              {/each}
              
            </div>
            {:else}
            <div class="text-gray-500 text-center">
              Belum ada Campaign.
            </div>
            {/if}
            
            <!--
            
            ADD YOUR MAIN CONTENT ABOVE
                  
            -->
          </div>

    </TsLayouts>
    <Modal title="Profil Twitter" bind:show="{profileModal}">
        <form on:submit|preventDefault={saveProfile}>
            <!-- Card -->
            <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
              <!-- Card Body -->
              <div class="p-5 lg:p-6 grow w-full border-l-4 border-orange-300">
                <h3 class="text-lg font-semibold mb-1">
                  Twitter Username
                </h3> 
                <div class=" ">
                  <input bind:value="{user.twitter_username}" class="block border px-3 border-gray-200 rounded py-2 leading-5 text-sm w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" placeholder="islamictroops" />
                  <div class="text-gray-500">
                    <small>tambahkan username twitter (tanpa @) agar sesama troops bisa saling follow</small>
                  </div>
                  <button type="submit" class="mt-3 block inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-orange-200 bg-orange-200 text-orange-700 hover:text-orange-700 hover:bg-orange-300 hover:border-orange-300 focus:ring focus:ring-orange-500 focus:ring-opacity-50 active:bg-orange-200">
                    Simpan
                  </button>
                </div>
              </div>
              <!-- END Card Body -->
            </div>
            <!-- END Card -->
          </form>
    </Modal>
</div>
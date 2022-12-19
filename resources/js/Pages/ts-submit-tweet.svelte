<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';   
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/ts-layouts.svelte';
  import { Inertia } from '@inertiajs/inertia';

export let campaign; 

export let tweets = [];

export let user;

let new_tweet = ""

function saveTweet()
{

    if(new_tweet.length >= 70)
    {
        Inertia.post("/buzzer/tweet",
        {
            content : new_tweet,
            campaign_id : campaign.id,
            published_by : user.id

        })
        new_tweet = ""
    }else{
        alert("Panjang Tweet minimal 70 karakter")
    }
   
}

</script>
<div>
<TsLayouts>

    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
        <div>
           <h1 class="text-2xl">
            {campaign.title}
           </h1>
           <div>
            {@html campaign.description}
           </div>
           <br>
           <div>
           
            <label class="font-bold " for="description"> Hestek Campaign </label>
           </div>
           <div>
            {campaign.hashtags}
           </div>
        </div>
        <hr class="my-5">
       

        <div class="grid gap-4 mb-3">
            <p>Yuk kontribusi memberikan kata-kata hebat anda agar TS kali ini bisa viral dan mengguncang dunia.</p>
            <p>Tulis tweet ada pada kolom berikut <strong>tanpa hashtag apapun</strong></p>
            
            
        </div>
        {#if tweets.length < 10} 
        <form on:submit|preventDefault={saveTweet}  enctype="multipart/form-data" class="space-y-6">
                       
         
            <div class="space-y-1">
              <label class="font-medium" for="description">Tweet {tweets.length + 1}</label>
              <textarea bind:value={new_tweet} class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="description" rows="4" placeholder="Tulis tweet anda"></textarea>
              <small class="text-gray-500">tulis tweet tanpa hashtag</small>
            </div>
            <div class="text-right">
                <button class="bg-orange-600 text-white px-4 py-2 rounded-lg">Kirim</button>
            </div>
        </form>
        {:else}
        <!-- Success Alert -->
<div class="p-4 md:p-5 rounded text-emerald-700 bg-emerald-100">
    <div class="flex items-center mb-2">
      <svg class="hi-solid hi-check-circle inline-block w-5 h-5 mr-3 flex-none text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      <h3 >Jazakallah! Semoga Tweet Storm kita sukses trending dan berkah!</h3>
    </div> 
  </div>
  <!-- END Success Alert -->
        {/if}
            
    </div>

    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
        {#each tweets as item}
        <!-- content here -->
        <div class="bg-white p-4 lg:p-8">
            {item.content}
        </div>
   {/each}
    </div>

</TsLayouts> 
</div>
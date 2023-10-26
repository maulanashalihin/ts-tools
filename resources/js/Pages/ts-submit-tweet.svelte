<script>
    import dayjs from 'dayjs';
import { inertia,Link,router } from '@inertiajs/svelte';   
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/ts-layouts.svelte'; 

export let campaign; 

export let tweets = [];

export let user;

let new_tweet = ""

function saveTweet()
{

    if(tweets && tweets.length > 10)
    {
        alert("Maaf, jumlah tweet")
    }

    if(new_tweet.length >= 70)
    {
        router.post("/buzzer/tweet",
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
        <form on:submit|preventDefault={saveTweet}    class="space-y-6">
                       
         
            <div class="space-y-1">
              <label class="font-medium" for="description">Tweet {tweets.length + 1}</label>
              <textarea bind:value={new_tweet} class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="description" rows="4" placeholder="Tulis tweet anda"></textarea>
              <small class="text-gray-500">tulis tweet tanpa hashtag</small>
            </div>
            <div class="text-right">
                <button class="bg-orange-600 text-white px-4 py-2 rounded-lg">Kirim</button>
            </div>
        </form>
 
            
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
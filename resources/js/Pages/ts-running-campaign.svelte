<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';   
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/ts-layouts.svelte';
  import { Inertia } from '@inertiajs/inertia';
  import { onMount } from 'svelte';


export let campaign; 

export let tweets = [];

export let buzzes = [];

export let medias = [];

export let profiles = [];

export let replies = [];

export let attendance;
 



let hashtag_text = "\n";


let hashtags = campaign.hashtags ? campaign.hashtags.split(",") : []

for (let i=0;i<campaign.hashtag_per_tweet;i++)
{
    
    const tag = hashtags[Math.floor(Math.random() * hashtags.length)];

    hashtag_text = hashtag_text+tag+'\n'; 
}  



 

let setRoundModal = false;

let mediaModal = false;

let tweet_done = [];
let follow_done = [];
let reply_done = []
let like_done = [];
let retweet_done = [];



let active_tweet = {}


 

function pickTweet()
{
    return tweets[Math.floor(Math.random() * tweets.length)].content;

}

if(!attendance.round_number)
{
    setRoundModal = true;

    attendance.join_time = Date.now()
}

if(attendance.next_round_time && dayjs().isAfter(attendance.next_round_time))
{
    attendance.current_round++;
    
    saveAkadTS();
}

function saveAkadTS()
{
    
    attendance.next_round_time = dayjs().add(attendance.next_round_interval,'minute').valueOf();
    attendance.round_number  = attendance.round_number;

    axios.put("/attendance/"+attendance.id,attendance)

    setRoundModal = false;
}

function UpdateScore()
{
    attendance.action_score++; 
    axios.put("/score/"+attendance.id)
}
 
onMount(()=>{
    var tag = document.createElement('script');

    tag.src = "https://platform.twitter.com/widgets.js";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})

 

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
            <p>Selesaikan TS Challenge dengan melakukan beberapa action berikut</p>
            {#if attendance.round_number}
           <div class="space-y-1">
            <h3 class="font-semibold">
              Round ({attendance.current_round} / {attendance.round_number})
            </h3>
            <div class="flex items-center w-full h-5 bg-orange-100 rounded-lg overflow-hidden">
              <div
                role="progressbar"
                aria-valuenow="{Math.floor(attendance.current_round / attendance.round_number * 100)}"
                aria-valuemin="0"
                aria-valuemax="100"
                class="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-orange-500 text-white text-sm font-semibold"
                style="width: {Math.floor(attendance.current_round / attendance.round_number * 100)}%;"
              >
              {Math.floor(attendance.current_round / attendance.round_number * 100)}%
              </div>
            </div>
          </div>
           {/if}
            <div class="grid grid-cols-2 gap-3">
                
                <div>
                    <label class="font-medium" for="tk-form-elements-name">Skor</label>
                    <div>
                        {attendance.action_score} poin
                    </div>
                </div>

                {#if attendance.next_round_time}
                <div>
                    <label class="font-medium" for="tk-form-elements-name">Round Selanjutnya</label>
                    <div>
                        {dayjs(attendance.next_round_time).format("DD-MM-YYYY HH:mm")}
                    </div>
                </div>
                {/if}
                
            </div>
            
        </div>
        
            
    </div>

    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
        <div class="font-bold text-lg">
            1. Tweet Konten ini
        </div>
        {#each tweets as item}
        <!-- content here -->
        <div class="bg-white p-4 ">
            {item.content}
            <div class="  mt-3 flex gap-3">
                {#if !tweet_done.includes(item.id)}
                    
                
                <a on:click={()=>{UpdateScore();tweet_done = [...tweet_done,item.id]}} href="https://twitter.com/intent/tweet?text={encodeURIComponent(item.content+hashtag_text)}" rel="noreferrer" target="_blank" class="  py-1  inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      tweet
                      
                  </a>
                <button  on:click={()=>{active_tweet = item;mediaModal = true}} class="   py-1 inline-flex">   
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      media
                      
                  </button>
                  {/if}
            </div>
        </div>
       
   {/each}
    </div>

    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
        <div class="font-bold flex gap-1 text-lg">
            2. Like <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-500">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              </span> dan Retweet <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                  
              </span>
        </div>
        {#each buzzes as item}
        <!-- content here -->
        <div class="bg-white p-4  ">
            {item.text}
            <div class="  mt-3 flex gap-3">
                {#if !like_done.includes(item.id)}
                    
             
                <a on:click={()=>{UpdateScore();like_done = [...like_done,item.id]}} href="https://twitter.com/intent/like?tweet_id={item.tweet_id}" rel="noreferrer"  target="_blank" class="  py-1  inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      like
                      
                      
                  </a>
                  {/if}
                  {#if !retweet_done.includes(item.id)}
                <a on:click={()=>{UpdateScore();retweet_done = [...retweet_done,item.id]}} href="https://twitter.com/intent/retweet?tweet_id={item.tweet_id}" rel="noreferrer"  target="_blank"  class="   py-1 inline-flex">   
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                      retweet
                      
                  </a>
                  {/if}
            </div>
        </div>
       
   {/each}
    </div>

    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
        <div class="font-bold  text-lg">
             3. Komentar pada tweet ini
        </div>
        {#each replies as item}
        <!-- content here -->
        <div class="bg-white p-4 ">
            {item.text}
            <div class="  mt-3"> 
                {#if !reply_done.includes(item.id)}
                 
                <a on:click={()=>{UpdateScore();reply_done = [...reply_done,item.id]}} href="https://twitter.com/intent/tweet?in_reply_to={item.tweet_id}&text={encodeURIComponent(pickTweet()+hashtag_text)}" rel="noreferrer" target="_blank" class="  py-1  inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                      komentar
                      
                  </a>
                    
              
                    {/if}
            </div>
        </div>
       
   {/each}
    </div>
    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
        <div class="font-bold  text-lg">
             4. Follow Akun Twitter ini
        </div>
        {#each profiles as item}
        <!-- content here --> 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div   class="bg-white p-4 flex justify-between ">
           
            <a  class="twitter-follow-button"
            href="https://twitter.com/{item.twitter_username}">
          Follow @{item.twitter_username}</a>
           
        </div> 
       
   {/each}
    </div>
 

</TsLayouts> 
</div>

<Modal bind:show="{mediaModal}" title="Pilih Media untuk Tweet">
 
    <div class="grid grid-cols-2 p-6 gap-3">
        {#each medias as item}
             <!-- content here -->
          
            <a on:click={()=>{UpdateScore();tweet_done = [...tweet_done,active_tweet.id];mediaModal = false}} href="https://twitter.com/intent/tweet?text={encodeURIComponent(active_tweet.content+hashtag_text)}+{item.twitter_url}" rel="noreferrer" target="_blank" class="  py-1  inline-flex">
                <img src="{item.media_url}" alt="">
              </a>
        {/each}
    </div>
</Modal>

<Modal bind:show="{setRoundModal}" title="Akad Tweet Storm">
    <div class="p-6">
        <p>Alhamdulillah, saya hari ini ikut siap TS sebanyak </p>
       

        <form on:submit|preventDefault={saveAkadTS} class="space-y-3 mt-3">
            <!-- Text Input -->
            <div class="space-y-1">
                <label class="font-medium" for="round_number">Jumlah Round</label>
                <input required bind:value="{attendance.round_number}" class="w-full block border border-gray-200 rounded px-3 py-2 leading-6 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50" type="number" id="round_number" placeholder="3" />
            </div>
            <div class="space-y-1">
                <label class="font-medium" for="next_round_interval">Jeda Antar Round</label>
                <select required bind:value="{attendance.next_round_interval}" class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="next_round_interval">
                    <option value="{30}">30 Menit</option> 
                    <option value="{60}">1 Jam</option> 
                    <option value="{120}">2 Jam</option> 
                  </select>
            </div>
            <button   class="inline-flex w-full justify-center items-center space-x-2 rounded border font-semibold focus:outline-none px-3 py-2 leading-6 border-orange-600 bg-orange-600 text-white hover:text-white hover:bg-amber-800 hover:border-amber-800 focus:ring focus:ring-amber-500 focus:ring-opacity-50 active:bg-orange-600 active:border-orange-600">
                Deal 🤝
              </button>
            <!-- END Password Input -->
          </form>
    </div>
</Modal>
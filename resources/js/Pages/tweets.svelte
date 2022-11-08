<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';   
import axios from "axios"
import Modal from '../Components/Modal.svelte'; 
  import { Inertia } from '@inertiajs/inertia';
  import Layouts from '../Components/layouts.svelte';

export let campaign; 

export let tweets = [];

export let counts;
 

let new_tweet = ""

function saveTweet()
{

    Inertia.post("/tweets",
    {
        content : new_tweet,
        campaign_id : campaign.id, 
        status : "published"

    })
    new_tweet = ""
}

function editTweet(e,item)
{
  
    if(e)
    if(e.target.innerText)
    {
      item.content = e.target.innerText;
    }
   
   axios.put("/tweets/"+item.id,item)
}

export let pathname = "onreview-tweets";

function loadMore()
{
  Inertia.reload()
  window.scrollTo({ top: 0, behavior: 'smooth' });

}
 

</script>
<div>
<Layouts>

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
       

        {#if pathname == 'all-tweets'}
      
        <form on:submit|preventDefault={saveTweet}    class="space-y-6 mt-6">
                      
        
            <div class="space-y-1">
              <label class="font-medium" for="description">Tweet {tweets.length + 1}</label>
              <textarea bind:value={new_tweet} class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="description" rows="4" placeholder="Tulis tweet anda"></textarea>
              
            </div>
            <div class="text-right">
                <button class="bg-orange-600 text-white px-4 py-2 rounded-lg">Kirim</button>
            </div>
        </form>
        {/if}
        
            
    </div>

    <div class="container my-3 px-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
     
        <!-- Pill Tabs -->
<nav class="flex items-center space-x-1 md:space-x-2">
    <a use:inertia href="onreview-tweets" class="{pathname.includes("onreview-tweets") ? 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100' : 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent'}">
      On Review
    </a>
    <a use:inertia href="all-tweets" class="{pathname.includes("all-tweets") ? 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100' : 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent'}">
      All Tweets
    </a> 
    <a use:inertia href="tweet-buzz" class="{pathname.includes("tweet-buzz") ? 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100' : 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent'}">
        Tweet Buzz
      </a> 
      <a use:inertia href="media" class="{pathname.includes("media") ? 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100' : 'px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent'}">
        Media
      </a> 
  </nav>
  <!-- END Pill Tabs -->
<!-- dibuat edit tweets


-->

<div class="  text-gray-600 text-sm">
  {#if pathname == 'onreview-tweets'}
    {counts} belum direview
  {/if}

  {#if pathname == 'all-tweets'}
  {tweets.length} total tweet terkumpul
{/if}
</div>
        {#each tweets as item}
        <!-- content here -->
        <div class="bg-white p-2 lg:p-8">
           
            <div on:blur={(e)=>{editTweet(e,item)}} contenteditable="true">
              {item.content}
            </div>
           <div>
            <div class="inline-flex mt-3">
                <button type="button" on:click={()=>{item.status = 'on review';editTweet(null,item)}} class="{item.status == 'on review' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}   inline-flex text-xs justify-center items-center space-x-2 border   focus:outline-none px-2 py-1 leading-6 rounded-l active:z-1 focus:z-1 -mr-px  border-gray-300   shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none">
                  on Review
                </button>
                <button type="button" on:click={()=>{item.status = 'published';editTweet(null,item)}} class="{item.status == 'published' ? 'bg-green-100 text-green-800' : 'text-gray-400'}  inline-flex text-xs  justify-center items-center space-x-2 border   focus:outline-none px-2 py-1 leading-6 active:z-1 focus:z-1 -mr-px border-gray-300 bg-white  shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none">
                  Setuju
                </button>
                <button type="button" on:click={()=>{item.status = 'rejected';editTweet(null,item)}} class="{item.status == 'rejected' ? 'bg-red-100 text-red-800' : 'text-gray-400'}  inline-flex text-xs justify-center items-center space-x-2 border   focus:outline-none px-2 py-1 leading-6 rounded-r active:z-1 focus:z-1 border-gray-300 bg-white  shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none">
                  Tolak
                </button>
              </div>
           </div>
        </div>
   {/each}
    <div class="my-4 text-center">
      <button class="border px-3 py-1" on:click={loadMore}>Load More Tweet</button>
    </div>
    </div>

</Layouts> 
</div>
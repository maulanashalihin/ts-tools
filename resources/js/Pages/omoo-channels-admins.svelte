<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';  
 
import axios from "axios" 
import TsLayouts from './../Components/layouts.svelte';
import { Inertia } from '@inertiajs/inertia';

export let channels;
 
function makeOfficial(channel)
{
   const check = confirm(`Apakah kamu yakin mengubah channel ${channel.name} menjadi official?`)
   if(check)
   {
    channel.official = true;
    channels = channels;
    axios.put("/make-official-channel/"+channel.id,channel)
   }
}

</script>
<div>
<TsLayouts>

    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <div class="text-xl font-medium">
            Daftar Channel
        </div>
        <div class="grid lg:grid-cols-3 gap-4 mt-5">
            {#each channels as item}
                 <!-- content here -->
                 <div class="bg-white rounded text-center p-4">
                    <div class="flex justify-center">
                        <img class="rounded-full h-16 w-16" src="{item.avatar}" alt="">
                    </div>
                    <div class="mt-3 flex justify-center gap-1">
                        {item.name}
                        {#if item.official}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-blue-500 w-5 h-5 mt-0.5">
                            <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                          </svg>
                           
                        {/if}
                    </div>
                    <div class="flex gap-1 justify-center mt-3 ">
                        {#if !item.official}
                       
                        <button class="border px-2 py-1" on:click={()=>{makeOfficial(item)}}>Make Official</button>
                        {/if}
                        <a class="border px-2 py-1"  href="/omoo-channels/{item.id}">Lihat</a>
                          
                    </div>
                </div>
            {/each}
            
          
            
        </div>
    </div>

</TsLayouts> 
</div>
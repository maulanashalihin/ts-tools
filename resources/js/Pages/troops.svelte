<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';   
import axios from "axios" 
import TsLayouts from './../Components/layouts.svelte';
  import { Inertia } from '@inertiajs/inertia';
 export let troops; 
</script>
<div>
<TsLayouts>

    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
         
       

        <div class="flex justify-between">
            <h1 class="text-2xl">Our Troops</h1>
            <a target="_blank" href="/download-troops" class="px-2 py-1 border border-gray-200 text-sm inline-flex gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download</a>
        </div>
        <hr class="my-6">
        <div class="grid gap-3">
         {#each troops.data as item}
             <!-- content here -->
             <div class="flex justify-between">
                <div>
                    {item.twitter_username}
                </div>
                <div class="text-gray-400">
                    {item.score}
                </div>
             </div>
         {/each}
        </div>
        
            
    </div>

   

</TsLayouts> 
</div>
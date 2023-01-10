<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';  
 
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/ts-layouts.svelte';
import { Inertia } from '@inertiajs/inertia';
 
 export let channel;

 export let contents;

 const statusColor = {
    pending : 'bg-gray-500',
    approved : 'bg-green-500',
    rejected : 'bg-red-500'
}


</script>
<div>
<TsLayouts>

    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <div class="text-xl font-medium">
            {channel.name}
        </div>
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5">
            <a use:inertia class="border-2   rounded text-center flex justify-center items-center" href="{channel.id}/content/create">
                <div class=" text-gray-500">
                   <div class="flex justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 ">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                      <div>
                        Tambah Post Baru
                      </div>
                </div>
            </a> 
            {#each contents as item}
                 <!-- content here -->
                 <div class="bg-white rounded  ">
                   
                    <div class="relative">
                        {#if item.type == 'image'}
                        <img src="{item.images_url}" alt="">
                        {/if}

                        {#if item.type == 'video'}
                            {#if item.thumbnail}
                            <img src="{item.thumbnail}" alt="">
                            {:else}
                            <img src="https://cdn.dribbble.com/users/17914/screenshots/4902225/media/0d6d47739dae97adc81ca7076ee56cc9.png?compress=1&resize=400x300" alt="">
                            {/if}
                        {/if}
                        
                        <div class="absolute top-4 left-4 {statusColor[item.status]} text-white  px-3 rounded-full">
                            {item.status}
                        </div>
                    </div>
                    <div class="p-3 ">
                        <div class="text-sm text-gray-500 whitespace-pre-line">
                            {item.caption}
                        </div>
                        
                        <div class="flex justify-center gap-3 mt-3">
                            <a use:inertia href="{channel.id}/content/{item.id}/edit">Edit</a> 
                        </div>
                    </div>
                   
               </div>
            {/each}
           
          
            
        </div>
    </div>

</TsLayouts> 
</div>
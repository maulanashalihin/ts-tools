<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';  
 
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/layouts.svelte';
import { Inertia } from '@inertiajs/inertia';
  

 export let contents;

function UpdateStatus(post,status)
{
    post.status = status;
    axios.put("/omoo-contents/"+post.id,post)
    contents = contents;
}

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
            Konten Omoo
        </div>
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5">
            
            {#each contents as item}
                 <!-- content here -->
                 <div class="bg-white rounded  ">
                    <div class="px-3 py-2 flex gap-3">
                        <img class="w-10 h-10 rounded-full" src="{item.channel_avatar}" alt="">
                        <div class="flex items-center">
                            {item.channel_name}
                        </div>
                    </div>
                    <div class="relative">
                        {#if item.type == 'image'}
                        <img src="{item.images_url}" alt="">
                        {/if}
                        <div class="absolute top-4 left-4 {statusColor[item.status]} text-white px-3 rounded-full">
                            {item.status}
                        </div>
                    </div>
                    <div class="p-3">
                        {item.caption}
                        <div class="flex justify-center gap-3 mt-3">
                            <div class="inline-flex">
                                <button on:click="{()=>{UpdateStatus(item,'pending')}}" type="button" class="{item.status == 'pending' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}   -mr-px border px-2 py-1 border ">
                                  pending
                                </button>
                                <button on:click="{()=>{UpdateStatus(item,'approved')}}" type="button" class="{item.status == 'approved' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}    border px-2 py-1 border">
                                  approve
                                </button>
                                <button on:click="{()=>{UpdateStatus(item,'rejected')}}" type="button" class="{item.status == 'rejected' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'}  -ml-px  border px-2 py-1 border">
                                  reject
                                </button>
                              </div>
                        </div>
                    </div>
                   
               </div>
            {/each}
           
          
            
        </div>
    </div>

</TsLayouts> 
</div>
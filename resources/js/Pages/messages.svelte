<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/svelte';   
import axios from "axios"
import Modal from '../Components/Modal.svelte';
import TsLayouts from './../Components/layouts.svelte'; 

import { validatePhone } from "../Components/helper";

export let messages;
export let api_keys;
let test_number;

function testNumber(api_key)
{
    if(test_number)
    {
      
        axios.post("/test-api",{test_number : validatePhone(test_number),api_key : api_key.id})
    }
    
}
 
function saveMessage(item)
{  
    setTimeout(()=>{
        axios.put("/messages/"+item.id,item)
    },100)
}
 

let new_api_key;
function addApiKey()
{
    api_keys = [...api_keys,{id : new_api_key}]
  
    axios.post("/api-keys",{id : new_api_key}).then(response=>{
        new_api_key = ""
    })
}

function deleteApiKey(key)
{
    const check = prompt("are you sure delete this api key?")
    if(check)
    {
        api_keys = api_keys.filter(item=>item.id != key.id)
    axios.delete("/api-keys/"+key.id)
    }
    
}

</script>
<div>
<TsLayouts>

    <div class="container grid gap-3  p-4 lg:p-8  max-w-lg mx-auto ">
        <div class="font-bold flex gap-1 text-lg">
            Pesan Otomatis
        </div>
        <div class="space-y-6">
        {#each messages as item}
        <!-- content here -->
        <div class="  space-y-3">
            
            <div class="space-y-1">
                <label class="font-medium" for="{item.id}">{item.id}</label>
                <textarea on:change={()=>{saveMessage(item)}} bind:value="{item.text}" class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="{item.id}" rows="8" placeholder="Enter further details"></textarea>
    
            </div>
             
              
           
        </div>
        
       
       
         {/each}
         <div class="font-bold flex gap-1 text-lg">
            Pesan Otomatis
        </div>
        <hr>
        <div class="space-y-1">
            <label for="tk-form-input-groups-append-button-secondary-small" class="font-medium">Tambah API Key</label>
            <form on:submit|preventDefault={addApiKey} class="flex items-center">
              <input bind:value="{new_api_key}" class="block border px-3 border-gray-200 rounded-l z-1 py-2 leading-5 text-sm w-full active:z-1 focus:z-1 -mr-px focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="tk-form-input-groups-append-button-secondary-small" placeholder="xxxxxxxxx" />
              <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none flex-none px-3 py-2 leading-5 text-sm rounded-r active:z-1 focus:z-1 border-indigo-200 bg-indigo-200 text-indigo-700 hover:text-indigo-700 hover:bg-indigo-300 hover:border-indigo-300 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-200 active:border-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
              </button>
            </form>
          </div>
        
        <div>
            <div class="space-y-1 mb-6">
                <label for="phone" class="font-medium">Test Number</label>
                <input bind:value="{test_number}" class="block border px-3 border-gray-200 rounded-l z-1 py-2 leading-5 text-sm w-full active:z-1 focus:z-1 -mr-px focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="phone" placeholder="xxxxxxxxx" />
                   
              </div>
            
            <div>
         <div>
         
            
                <!-- List Group -->
<ul class="border border-gray-200 rounded bg-white divide-y divide-gray-200">
    {#each api_keys as item}
         <!-- content here -->
         <li class="p-4 flex justify-between items-center">
            <span class="font-semibold text-sm mr-1">{item.id}</span>
            <span class="flex gap-1"><button class="text-red-500 text-sm" on:click={()=>{deleteApiKey(item)}} >hapus</button>
                <button class="text-green-500 text-sm" on:click={()=>{testNumber(item)}} >test</button></span>
          </li> 
    {/each}
   
  </ul>
  <!-- END List Group -->
            </div>
         </div>
        </div>
    </div>

</TsLayouts> 
</div>
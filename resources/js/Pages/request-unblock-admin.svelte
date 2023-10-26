<script>
    import dayjs from "dayjs";
    import { inertia, Link } from "@inertiajs/svelte";
    import axios from "axios";
    import Layouts from "../Components/layouts.svelte";
    export let unblocks = [];

    function editUnblock(item)
    {
        if(item.status == 'approved' || (item.status == 'rejected' && item.rejected_reason))
        axios.put("/unblocks/"+item.id,item)
    }
  </script>
  
  <div>
    <Layouts>
      <div class="container lg:mt-6 max-w-lg mx-auto  p-4 lg:p-8">
        <div class="flex justify-between">
          <h1 class="text-2xl">Request Unblock</h1>
          
        </div> 
        <div class="grid gap-3 mt-6">
          {#each unblocks as item}
            <!-- content here -->
            <div class="bg-white px-6 py-4 ">
                <div class="flex justify-between">
                    <div>
                      {item.name}
                      <div class="text-gray-400"><small>{item.phone}</small> / <small>{item.tg_id}</small></div>
                    </div>
                    <div class=" ">
                        {#if item.status == 'pending'}
                        <select value="{item.status}" on:change="{(e)=>{item.status = e.target.value;editUnblock(item)}}"  >
                            <option  >pending</option>
                            <option  >approved</option>
                            <option  >rejected</option>
                        </select>
                        {:else if item.status == 'approved'}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> approved </span>
                        {:else if item.status == 'rejected'}
                             <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"> rejected </span>
                        {/if}
                        
                    </div>
                  </div>
                  <div class="mt-3 text-gray-600">
                   <small> {item.reason}</small>
                  </div> 
                  {#if item.status == 'rejected'}
                  <form on:submit|preventDefault={()=>{editUnblock(item)}}  class="space-y-3 mt-3">
                    <!-- Textarea -->
                    <div class="space-y-1">
                      <label class="font-medium" for="tk-form-elements-textarea">Alasan Ditolak</label>
                      <textarea item.rejected_reason class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="tk-form-elements-textarea" rows="4" placeholder="Enter further details"></textarea>
                    </div>
                    <div>
                        <!-- Button -->
                        <button type="submit" class="inline-flex w-full justify-center items-center space-x-2 rounded border font-semibold focus:outline-none px-3 py-2 leading-6 border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                          Kirim
                        </button>
                        <!-- END Button -->
                      </div>
                    <!-- END Textarea -->
                  </form>
                  {/if}
            </div>
          {/each}
          {#if unblocks.length == 0}
            <div class="text-gray-400">
              no issue
            </div>
            
          {/if}
        </div>
      </div>
    </Layouts>
  </div>
  
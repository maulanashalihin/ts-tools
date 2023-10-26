<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import axios from "axios";
  import TsLayouts from "./../Components/layouts.svelte";
  export let troops;

  function unblock(item)
  {
    item.blocked = false;
    troops = troops;
    axios.put("/troops/"+item.id,{blocked : false,pin_set : false,pin_hash : null})
  }
 
</script>

<div>
  <TsLayouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <div class="flex justify-between">
        <h1 class="text-2xl">Our Troops</h1>
        <a
          target="_blank"
          href="/download-troops"
          class="px-2 py-1 border border-gray-200 text-sm inline-flex gap-1"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download</a
        >
      </div>
      <div class="text-gray-400 text-sm mt-1">
        {troops.meta.total} total troops
      </div>
      <div>
        <hr class="my-3">
        <!-- <input class="border px-3 py-2 my-6" type="text" placeholder="Cari Troop by ID"> -->
      </div> 
      <div class="grid gap-3">
        {#each troops.data as item}
          <!-- content here -->
          <div class="flex justify-between">
            <div class="flex gap-1">
              <div 
            >
              {item.name}  {item.twitter_username != 'null' ? `(${item.twitter_username})` : ''} 
            </div>
            {#if item.blocked}
             <button on:click="{()=>{unblock(item)}}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             </button>
              
              {/if}
            </div>
            <div class="text-gray-400">
              {item.score}
              
            </div>
          </div>
        {/each}
      </div>
      <nav class="mt-4">
        <ul class="inline-flex items-center -space-x-px">
          {#if troops.meta.current_page > 1}
            <li>
              <a
                href="/troops?page={troops.meta.current_page - 1}"
                class="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Previous</span>
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  /></svg
                >
              </a>
            </li>
          {/if}
          {#each Array(troops.meta.last_page) as _, i}
            {#if i + 1 == troops.meta.current_page}
              <li>
                <a
                  href="/troops?page={i + 1}"
                  class="z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >{i + 1}</a
                >
              </li>
            {:else}
              <li>
                <a
                  href="/troops?page={i + 1}"
                  class="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >{i + 1}</a
                >
              </li>
            {/if}
          {/each}
          {#if troops.meta.current_page < troops.meta.last_page}
            <li>
              <a
                href="/troops?page={troops.meta.current_page + 1}"
                class="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span class="sr-only">Next</span>
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  /></svg
                >
              </a>
            </li>
          {/if}
        </ul>
      </nav>
    </div>
  </TsLayouts>
</div>

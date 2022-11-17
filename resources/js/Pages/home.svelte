<script>
	import dayjs from 'dayjs';
	import { inertia,Link } from '@inertiajs/inertia-svelte';
  const { default: Layouts } = require("../Components/layouts.svelte");
  export let user;
  export let campaigns = [];
  let timezone = "WIB"

  const offset = new Date().getTimezoneOffset();

  if(offset == -480)
  {
    timezone = "WITA"
  }

  if(offset == -540)
  {
    timezone = "WIT"
  }


</script>
<Layouts>
    <!-- Page Heading -->
    <div class="bg-white">
        <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
          <div class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0">
            <div class="grow">
              <h1 class="text-xl font-bold text-gray-700 mb-1">
                Campaigns
              </h1>
              <h2 class="text-sm text-gray-500 font-medium">
                Welcome <span class="text-orange-600 hover:text-orange-400">{user.name}</span>, everything seems great!
              </h2>
            </div>
            <div class="flex-none flex items-center justify-center sm:justify-end space-x-2 py-3 rounded sm:bg-transparent px-2 sm:px-0">
              <a href="/campaign/create" use:inertia class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-orange-600 bg-orange-600 text-white hover:text-white hover:bg-orange-700 hover:border-orange-700 focus:ring focus:ring-orange-500 focus:ring-opacity-50 active:bg-orange-600 active:border-orange-600">
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="opacity-50 hi-solid hi-plus inline-block w-5 h-5"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                <span>New Campaign</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- END Page Heading -->
  
      <!-- Page Section -->
      <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <!--
  
        ADD YOUR MAIN CONTENT BELOW
  
        -->
  
        
        <div class="grid lg:grid-cols-3 gap-3 lg:gap-6">
          {#each campaigns as item}
             <!-- content here -->
             <div  class="rounded-lg bg-white  justify-between p-4 sm:p-5">
              <div class="flex items-center space-x-4"> 
                <div>
                  <h3 class="text-lg font-medium text-slate-700 dark:text-navy-100">
                    {item.title}
                  </h3> 
                </div>
              </div>
              <div class="mt-4">
                <p class="text-xs+">{dayjs(item.time).format("DD MMM YYYY")}</p>
                <p class="text-xl font-medium text-slate-700 dark:text-navy-100">
                  {dayjs(item.time).format("HH:mm")} {timezone}
                </p>
                <div class="text-md">
                  {item.hashtags}
                </div>
                <div class="mt-5 flex items-center justify-between space-x-2">
                  {#if item.status == 'tweet submission'}
                  <div class="flex -space-x-3 text-sm">
                     {item.tweets.total} tweet terkumpul
                   </div>
                  {:else}
                  <div class="flex -space-x-3 text-sm">
                    <Link href="/campaign/{item.id}/troops">diikuti oleh {item.attendee || 0} orang</Link>
                   </div>
                  {/if}
                 <div class="flex gap-2">
                  <Link href="/campaign/{item.id}/edit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>
                <Link href="/campaign/{item.id}/onreview-tweets">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </Link>
                <Link href="/campaign/{item.id}/report">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  
                </Link>
                  
                 </div>
                 
                </div>
              </div>
            </div>
          {/each}
          
        </div>
        
        <!--
        
        ADD YOUR MAIN CONTENT ABOVE
              
        -->
      </div>
      <!-- END Page Section -->
</Layouts>
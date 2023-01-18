<script>
	import dayjs from 'dayjs';
	import { inertia,Link } from '@inertiajs/inertia-svelte';
  import { t } from '../Language/lang';
  const { default: Layouts } = require("../Components/layouts.svelte");
  export let strats;  


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
                Strat Plans
              </h1>
              <h2 class="text-sm text-gray-500 font-medium">
                Rencana Strategis Opini Indonesia Dwi mingguan
              </h2>
            </div>
            <div class="flex-none flex items-center justify-center sm:justify-end space-x-2 py-3 rounded sm:bg-transparent px-2 sm:px-0">
              <a href="/strat-plan/create" use:inertia class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-orange-600 bg-orange-600 text-white hover:text-white hover:bg-orange-700 hover:border-orange-700 focus:ring focus:ring-orange-500 focus:ring-opacity-50 active:bg-orange-600 active:border-orange-600">
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="opacity-50 hi-solid hi-plus inline-block w-5 h-5"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                <span>Strat Plan</span>
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
          {#each strats as item}
             <!-- content here -->
             <div  class="rounded-lg bg-white  justify-between p-4 sm:p-5">
               
              <div class="mt-4">
                <p class="text-xs">{dayjs(item.start_time_string).format("DD-MM-YYYY")} s.d {dayjs(item.end_time_string).format("DD-MM-YYYY")}</p>
                <p class="text-xl font-medium text-slate-700 dark:text-navy-100">
                  {item.title}
                </p>
                 
                <div class="mt-5 flex items-center justify-between space-x-2">
                  
                 <div class="flex gap-2">
                  <Link href="/strat-plan/{item.id}/edit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
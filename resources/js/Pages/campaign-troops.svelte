<script>
    import { Inertia } from "@inertiajs/inertia";
  import axios from "axios";
    import dayjs from "dayjs"
    import { onMount } from 'svelte';
  
      const { default: Layouts } = require("../Components/layouts.svelte");
      export let campaign

      export let troops;
  
   
    </script>
    <Layouts>
        <!-- Page Heading -->
        <div class="bg-white">
            <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              <div class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0">
                <div class="grow">
                  <h1 class="text-xl font-bold text-gray-700 mb-1">
                    CampaignTroopers "{campaign.title}"
                  </h1>
                  
                </div>
                
              </div>
            </div>
          </div>
          <!-- END Page Heading -->
      
          <!-- Page Section -->
          <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              
   <!-- Responsive Table Container -->
<div class="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
    <!-- Alternate Responsive Table -->
    <table class="min-w-full text-sm align-middle">
      <!-- Table Header -->
      <thead>
        <tr class="bg-gray-50">
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase   text-center">
            No
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
            Name
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
            Phone
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
            Progress
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
            Twet Submit
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center">
            Score
          </th>
          <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center">
            Actions
          </th>
        </tr>
      </thead>
      <!-- END Table Header -->
  
      <!-- Table Body -->
      <tbody>
        {#each troops as item,i}
             <!-- content here -->
             <tr>
                <td class="p-3 hidden md:table-cell text-center">
                    {i+1}
                </td>
                <td class="p-3">
                  <p class="font-medium">
                    {item.troop_username}
                  </p> 
                </td>
                <td class="p-3 hidden md:table-cell text-gray-500">
                    {item.troop_phone}
                </td>
                <td class="p-3 hidden md:table-cell text-gray-500">
                  {item.current_round}  / {item.round_number}
                </td>
                <td class="p-3 hidden md:table-cell text-gray-500">
                    {item.tweet_submit_number}
                  </td>

                <td class="p-3 text-center">
                  <span class="w-4 h-4 bg-emerald-300 rounded-full inline-block md:hidden">&nbsp;</span>
                  <div class="font-semibold px-2 py-1 leading-4 hidden md:inline-block text-xs rounded-full text-emerald-700 bg-emerald-200">{item.action_score}</div>
                </td>
                <td class="p-3 text-center">
                  <!-- <button type="button" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none">
                    <svg class="hi-solid hi-pencil inline-block w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                    <span class="hidden sm:inline">Edit</span>
                  </button> -->
                </td>
              </tr>
               
        {/each}
      </tbody>
      <!-- END Table Body -->
    </table>
    <!-- END Alternate Responsive Table -->
  </div>
  <!-- END Responsive Table Container -->
  
               
       
          </div> 
    </Layouts>
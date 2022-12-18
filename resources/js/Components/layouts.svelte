<script>
  import { fly } from 'svelte/transition';
import {clickOutside} from './helper.js';
  import { page } from '@inertiajs/inertia-svelte'
import { Inertia } from '@inertiajs/inertia';

import { inertia } from '@inertiajs/inertia-svelte';   
  let profilMenu = false;
  let menuTogle = false;

  function Logout()
  {
    Inertia.post("/logout")
  }

  let menu = [{
    path : "/home",
    name : "Campaign"
  },{
    path : "/troops",
    name : "Troops"
  },{
    path : "/riayah",
    name : "Riayah"
  },{
    path : "/messages",
    name : "Message"
  },{
    path : "/users",
    name : "User"
  },{
    path : "/omoo-contents",
    name : "Konten Omoo"
  },{
    path : "/omoo-channels",
    name : "Channel Omoo"
  }]

  let pathname = location.pathname;

  

</script> 
<div id="page-container" class="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
  <!-- Page Header -->
  <header id="page-header" class="flex flex-none items-center bg-orange-600 z-1">
    <div class="container xl:max-w-7xl mx-auto px-4 lg:px-8">
      
      <div class="flex justify-between py-4">
        <!-- Left Section -->
        <div class="flex items-center space-x-2 lg:space-x-6">
          <!-- Logo -->
          <a href="/home"  class="group inline-flex items-center space-x-2 font-semibold text-lg tracking-wide text-white hover:text-orange-300 active:text-gray-200">

             <span class="  sm:inline-block">TS Tools </span>
          </a>
          <!-- END Logo -->

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex lg:items-center lg:space-x-2">
            {#each menu as item}
               <!-- content here -->
               <a href="{item.path}" use:inertia  class="{pathname == item.path ? 'text-sm font-medium flex items-center space-x-2 px-3 py-2   border-b-2 border-white   text-white' : 'text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded text-orange-200 border border-transparent hover:text-white '}">
                <span>{item.name}</span>
              </a>
            {/each}
            
          
          </nav>
          <!-- END Desktop Navigation -->
        </div>
        
        <!-- END Left Section -->

        <!-- Right Section -->
        <div class="flex items-center space-x-1 lg:space-x-2">
       
          <!-- User Dropdown -->
          <div class="relative inline-block">
            <!-- Dropdown Toggle Button -->
            <button
            on:click={()=>{profilMenu = !profilMenu}}
              type="button"
              class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm  border-none bg-orange-600 text-gray-200   hover:text-white hover:bg-opacity-50     "
              id="tk-dropdown-layouts-user"
              aria-haspopup="true"
              aria-expanded="true"
            >
            {#if $page.props.user}
            <span>{$page.props.user.name || $page.props.user.email}</span>
            {/if}
            
            
              <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="opacity-50 hi-solid hi-chevron-down inline-block w-5 h-5"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            <!-- END Dropdown Toggle Button -->

            <!-- Dropdown --> 
            {#if profilMenu}
            <div use:clickOutside on:click_outside={()=>{profilMenu = false}} transition:fly="{{ y: -50, duration: 500 }}"  role="menu" aria-labelledby="tk-dropdown-layouts-user" class="  absolute right-0 origin-top-right mt-2 w-48 shadow-xl rounded">
              <div class="bg-white ring-1 ring-black ring-opacity-5 rounded divide-y divide-gray-100">
                <div class="p-2 space-y-1">
                  <a  use:inertia role="menuitem" href="/profile" class="flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700">
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="opacity-50 hi-solid hi-user-circle inline-block w-5 h-5"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
                    <span>Profile</span>
                  </a> 
                </div>
                
                <div class="p-2 space-y-1">
                  <form on:submit|preventDefault={Logout}>
                    <button type="submit" use:inertia role="menuitem" class="w-full text-left flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700">
                      <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="opacity-50 hi-solid hi-lock-closed inline-block w-5 h-5"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                      <span>Sign out</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <!-- END Dropdown -->
            {/if}
          </div>
          <!-- END User Dropdown -->

          <!-- Toggle Mobile Navigation -->
          <div class="lg:hidden">
            <button type="button" on:click={()=>{menuTogle = true }} class="inline-flex justify-center items-center space-x-2   font-semibold focus:outline-none px-3 py-2 leading-5 text-sm    text-orange-200   hover:text-white hover:bg-opacity-50   focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-opacity-100 active:shadow-none">
              <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="hi-solid hi-menu inline-block w-5 h-5"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
          <!-- END Toggle Mobile Navigation -->
        </div>
        <!-- END Right Section -->
      </div>

      <!-- Mobile Navigation -->
      <!-- 
        Visibility
          Closed        'hidden'
          Opened        '' (no class)
      -->
      {#if menuTogle}
      <div use:clickOutside on:click_outside={()=>{menuTogle = false}}  class="lg:hidden" transition:fly="{{ y: -50, duration: 500 }}" >
          <nav class="flex flex-col space-y-2 py-4  ">
          
           {#each menu as item}
           <!-- content here -->
          
          <a use:inertia href="{item.path}" class="{pathname == item.path ? 'text-sm font-medium flex items-center space-x-2 px-3 py-2   border-b border-white   text-white' : 'text-sm font-medium flex items-center space-x-2 px-3 py-2   text-orange-200 border border-transparent hover:text-white '}">
            <span>{item.name}</span>
         </a>
        {/each}
             
          </nav>
        </div>
      {/if}
      <!-- END Mobile Navigation -->
    </div>
  </header>
  <!-- END Page Header -->

  <!-- Page Content -->
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <slot></slot>
  </main>
  <!-- END Page Content -->
</div>
<!-- END Page Container -->
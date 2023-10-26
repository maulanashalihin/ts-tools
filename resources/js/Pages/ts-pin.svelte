<script>
    import { inertia,router } from '@inertiajs/svelte'  
    import Toastify from 'toastify-js'
     

    let pin = '';
    export let errors;
    export let user;
    
    

    $:if(pin.length == 6)
    {
        login()
    }
    
    function login()
    {
       router.post("/pin",{pin})
       pin = ''
    }
    </script>
    <!-- Page Container -->
    <div id="page-container" class="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
        <!-- Page Content -->
        <main id="page-content" class="flex flex-auto flex-col max-w-full">
          <div class="min-h-screen flex items-center justify-center relative overflow-hidden max-w-10xl mx-auto p-4 lg:p-8 w-full">
            <!-- Patterns Background -->
            <div class="pattern-dots-md text-gray-300 absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-16 translate-y-16"></div>
            <div class="pattern-dots-md text-gray-300 absolute bottom-0 left-0 w-32 h-32 lg:w-48 lg:h-48 transform -translate-x-16 -translate-y-16"></div>
            <!-- END Patterns Background -->
      
            <!-- Sign In Section -->
            <div class="py-6   w-full max-w-md   relative">

              <!-- Header -->
              <div class="mb-8 text-center">
                <h1 class="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
                    <span>{user.pin_set ? 'Masukan PIN' : 'Buat PIN Baru'}</span>
                </h1> 
              </div>
              <!-- END Header -->
        
              <!-- Sign In Form -->
              <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
                <div class="p-6   grow w-full">
                  
                    <!-- Warning Alert -->
                    {#if errors}
                    <div class="p-4 md:p-5 mb-6 rounded text-orange-700 bg-orange-100">
                        <div class="flex items-center">
                          <svg class="hi-solid hi-exclamation inline-block w-5 h-5 mr-3 flex-none text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                          <h3 class="font-semibold grow">
                            {errors}
                          </h3> 
                        </div>
                      </div>
                    {/if}
  <!-- END Warning Alert -->
                    <div class="flex justify-center">
                        <input type="text"  class="w-1/2 text-3xl mx-auto border px-3 py-2" bind:value={pin}>
                    </div>
                    <div class="grid grid-cols-3 mt-6">
                       {#each [1,2,3,4,5,6,7,8,9,'*',0,'#'] as numbr}
                         <button on:click={()=>{pin = pin+numbr}} class="border cursor-pointer -mx-px flex items-center justify-center py-3 text-3xl">{numbr}</button> 
                       {/each}
                        
                    </div>

                </div>        
               
              </div>
              <!-- END Sign In Form -->
      
              <!-- Footer -->
              
              <!-- END Footer -->
            </div>
            <!-- END Sign In Section -->
          </div>
        </main>
        <!-- END Page Content -->
      </div>
      <!-- END Page Container -->
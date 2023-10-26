<script>
    export let show = false;
    export let title = "Modal Title";

    import { fly } from 'svelte/transition';
</script>
  
  <!-- Modal Backdrop -->
  <!--
    Visibility
      Closed        'hidden'
      Opened        '' (no class)
  
    Show/Hide with transitions
      enter         'transition ease-out duration-200'
      enter-start   'transform opacity-0'
      enter-end     'transform opacity-100'
      leave         'transition ease-in duration-100'
      leave-start   'transform opacity-100'
      leave-end     'transform opacity-0'
  -->
  <div
    class="{show || 'hidden'} z-90 fixed inset-0 overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-75 p-4 lg:p-8"
    tabindex="-1"
    role="dialog"
    aria-labelledby="tk-modal-simple"
    aria-hidden="false"
  >
    <!-- Modal Dialog -->
    <!--
      Show/Hide with transitions
        enter         'transition ease-out duration-200'
        enter-start   'transform opacity-0 scale-125'
        enter-end     'transform opacity-100 scale-100'
        leave         'transition ease-in duration-100'
        leave-start   'transform opacity-100 scale-100'
        leave-end     'transform opacity-0 scale-125'
    -->
    {#if show}
    <div transition:fly="{{ y: -50, duration: 500 }}"  class="flex flex-col rounded shadow-sm bg-white overflow-hidden w-full max-w-md mx-auto" role="document">
        <div class="py-4 px-5 lg:px-6 w-full bg-gray-50 flex justify-between items-center">
          <h3 class="font-medium">
            {title}
          </h3>
          <div class="-my-4">
            <button on:click={()=>{
              show = false
            }} type="button" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-transparent text-gray-600 hover:text-gray-400 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:text-gray-600">
              <svg class="hi-solid hi-x inline-block w-4 h-4 -mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
        <slot></slot>
      </div>
    {/if}
    
    <!-- END Modal Dialog -->
  </div>
  <!-- END Modal Backdrop -->
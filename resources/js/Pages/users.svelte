<script>
    import dayjs from 'dayjs';
import { inertia,Link } from '@inertiajs/inertia-svelte';   
import axios from "axios" 
import TsLayouts from '../Components/layouts.svelte';
  import { Inertia } from '@inertiajs/inertia';
 export let users; 
</script>
<div>
<TsLayouts>

    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
         
       

        <div class="flex justify-between">
            <h1 class="text-2xl">User</h1>
            <a use:inertia href="/users/create" class="px-2 py-1 border border-gray-200 text-sm inline-flex gap-1">
              User Baru</a>
            
        </div>
        <hr class="my-6 ">
        <div class="grid gap-3">
         {#each users as item}
             <!-- content here -->
             <div class="flex justify-between">
                <div>
                    {item.name}
                </div>
                <div class="text-gray-400 text-xs">
                    {item.email}
                </div>
             </div>
         {/each}
        </div>
            
    </div>

   

</TsLayouts> 
</div>
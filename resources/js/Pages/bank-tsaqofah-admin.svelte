<script>
    import dayjs from "dayjs";
    import { inertia, Link } from "@inertiajs/svelte";
  
    import axios from "axios";
    import Modal from "../Components/Modal.svelte";
    import Layouts from "./../Components/layouts.svelte";
  
    export let tsaqofah; 

    tsaqofah.forEach(item=>{
      item.files = JSON.parse(item.files)
    })
  </script>
  
  <div>
    <Layouts>
      <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
        <div class="text-xl font-medium">Review Submission</div>
        <div class="grid lg:grid-cols-3 gap-4 mt-5">
          {#each tsaqofah as item}
            <!-- content here -->
            <Link href="/bank-tsaqofah/{item.id}/review"  class="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div class="flex-shrink-0">
                <img class="h-48 w-full object-cover" src="{item.thumbnail || 'https://sin1.contabostorage.com/a196457ae22540fb8b66fd8bd8a37ae4:tsaqofah/THUMBNAIL.jpg'}" alt="">
              </div>
              <div class="flex-1 bg-white px-5 py-4 flex flex-col justify-between">
                <div class="flex-1">
                  
<span class="-ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> {item.status} </span>
                  <div class="block mt-2">
                    <p class="text-xl font-semibold text-gray-900">{item.title}</p>
                    <p class="mt-3 text-base text-gray-500 truncate">{item.content}.</p>
                  </div>
                </div>
                <div class="mt-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clip-rule="evenodd" />
                  </svg>
                  
                   {#each item.files as file}
                   <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"> {file.type} </span>
                   {/each}
                </div>
              </div>
            </Link>
          {/each}
  
          
        </div>
      </div>
    </Layouts>
  </div>
  
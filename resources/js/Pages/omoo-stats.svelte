<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import { t } from "../Language/lang";
  import Layouts from "../Components/layouts.svelte";

  export let daily_open_rate;
  export let daily_open_rate_unique;
  export let open_rate_per_city;
    export let daily_share_rate;
    export let   daily_share_rate_unique;
     export let   share_rate_per_city;
</script>

<Layouts>
  <!-- Page Heading -->
  <div class="bg-white">
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div
        class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0"
      >
        <div class="grow">
          <h1 class="text-xl font-bold text-gray-700 mb-1">Omoo Statistik</h1>
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
    <div class="grid gap-3 lg:grid-cols-3">
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Daily Open Rate</div>
          {#each daily_open_rate as item}
            <div class="flex justify-between">
              <div>
                {item.date_only}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Daily Share Rate</div>
          {#each daily_share_rate as item}
            <div class="flex justify-between">
              <div>
                {item.date_only}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">
            Daily Unique People Open Rate
          </div>
          {#each daily_open_rate_unique as item}
            <div class="flex justify-between">
              <div>
                {item.date_only}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">
            Daily Unique People Share Rate
          </div>
          {#each daily_share_rate_unique as item}
            <div class="flex justify-between">
              <div>
                {item.date_only}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Open Rate by Cities</div>
          {#each open_rate_per_city as item}
            <div class="flex justify-between">
              <div>
                {item.city}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Share Rate by Cities</div>
          {#each share_rate_per_city as item}
            <div class="flex justify-between">
              <div>
                {item.city}
              </div>
              <div>
                {item.total.toLocaleString("id")}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!--
        
        ADD YOUR MAIN CONTENT ABOVE
              
        -->
    </div>
    <!-- END Page Section -->
  </div></Layouts
>

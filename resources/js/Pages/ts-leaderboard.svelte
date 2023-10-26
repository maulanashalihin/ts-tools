<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import axios from "axios";
  import TsLayouts from "./../Components/ts-layouts.svelte";
  export let leaderboards;
</script>

<div>
  <TsLayouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <h1 class="text-2xl">Leaderboard</h1>
      <hr class="my-6" />

      <div class="grid gap-3">
        {#each leaderboards as item}
          <!-- content here -->
          <div class="flex justify-between">
            <div>
              {item.twitter_username}
            </div>
            <div class="text-gray-400">
              {item.score}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </TsLayouts>
</div>

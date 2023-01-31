<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/ts-layouts.svelte";

  export let histories;
</script>

<div>
  <TsLayouts>
    <div class="container grid gap-3  p-4 lg:p-8  max-w-lg mx-auto ">
      <div class="font-bold flex gap-1 text-lg">Riwayat Campaign</div>
      {#if histories.length}
        {#each histories as item}
          <!-- content here -->
          <div class="bg-white p-4  space-y-6">
            <div class="flex justify-between">
              <div>
                {item.campaign_title}
              </div>
              <div class="text-xs text-gray-400">
                {dayjs(item.campaign_time).format("DD MMM YYYY")}
              </div>
            </div>
            {#if item.round_number}
              <div class="space-y-1">
                <h3 class="font-semibold">
                  Round ({item.current_round} / {item.round_number})
                </h3>
                <div
                  class="flex items-center w-full h-5 bg-orange-100 rounded-lg overflow-hidden"
                >
                  <div
                    role="progressbar"
                    aria-valuenow={Math.floor(
                      (item.current_round / item.round_number) * 100
                    )}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    class="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-orange-500 text-white text-sm font-semibold"
                    style="width: {Math.floor(
                      (item.current_round / item.round_number) * 100
                    )}%;"
                  >
                    {Math.floor(
                      (item.current_round / item.round_number) * 100
                    )}%
                  </div>
                </div>
              </div>
            {/if}
            <div class="grid grid-cols-2">
              <div>
                <div class="text-sm font-medium">Skor</div>
                <div>
                  {item.action_score}
                </div>
              </div>
              <div>
                <div class="text-sm font-medium">Tweet Submission</div>
                <div>
                  {item.tweet_submit_number}
                </div>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-gray-500">Belum pernah ikut campaign</div>
      {/if}
    </div>
  </TsLayouts>
</div>

<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";

  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/ts-layouts.svelte";

  export let channels;
</script>

<div>
  <TsLayouts>
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div class="text-xl font-medium">Daftar Channel</div>
      <div class="grid lg:grid-cols-3 gap-4 mt-5">
        {#each channels as item}
          <!-- content here -->
          <div class="bg-white rounded text-center p-4">
            <div class="flex justify-center">
              <img class="rounded-full h-16 w-16" src={item.avatar} alt="" />
            </div>
            <div class="mt-3">
              {item.name}
            </div>
            <div class="flex gap-3 justify-center mt-3">
              <a
                use:inertia
                class="border px-3 py-1"
                href="/channel/{item.id}/edit"
              >
                Edit Channel
              </a>
              <a use:inertia class="border px-3 py-1" href="/channel/{item.id}">
                Post Konten
              </a>
            </div>
          </div>
        {/each}

        <a
          use:inertia
          style="min-height : 120px"
          class="border-2   rounded text-center flex justify-center items-center"
          href="/channel/create"
        >
          <div class=" text-gray-500">
            <div class="flex justify-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-12 h-12 "
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>Buat Channel Baru</div>
          </div>
        </a>
      </div>
    </div>
  </TsLayouts>
</div>

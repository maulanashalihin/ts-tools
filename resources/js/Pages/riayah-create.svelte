<script>
  import dayjs from "dayjs";
  import { inertia, Link, router } from "@inertiajs/svelte";
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/layouts.svelte";

  export let campaign = {
    buttons: [],
  };

  let new_button;
  function saveMessage() {
    if (campaign.buttons.length) {
      if (campaign.id) {
        router.put("/riayah/" + campaign.id, campaign);
      } else {
        router.post("/riayah", campaign);
      }
    } else {
      alert("Mohon tambahkan button");
    }
  }

  function addButton() {
    if (new_button) {
      campaign.buttons = [...campaign.buttons, new_button];
    }
  }
</script>

<div>
  <TsLayouts>
    <div class="container grid gap-3  p-4 lg:p-8  max-w-lg mx-auto ">
      <div class="font-bold flex gap-1 text-lg">Kirim Pesan kepada Troops</div>
      <div class="space-y-6">
        <!-- content here -->
        <form class=" space-y-3" on:submit|preventDefault={saveMessage}>
          <div class="space-y-1">
            <label class="font-medium" for="text">Konten Pesan</label>
            <textarea
              bind:value={campaign.text}
              class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              id="text"
              rows="8"
              placeholder="Enter further details"
            />
          </div>
          <div>
            <div class="font-medium">Tombol</div>
            {#if campaign.buttons.length}
              <div class=" grid gap-1 my-2">
                {#each campaign.buttons as button}
                  <!-- content here -->
                  <div>
                    <!-- Badge with close button -->
                    <div
                      class="font-semibold inline-flex px-2 py-1 leading-4 campaigns-center space-x-1 text-sm rounded text-teal-700 bg-teal-200"
                    >
                      <span>{button}</span>
                      <button
                        type="button"
                        on:click={() => {
                          campaign.buttons = campaign.buttons.filter(
                            (btn) => btn != button
                          );
                        }}
                        class="focus:outline-none text-teal-600 hover:text-teal-400 focus:ring focus:ring-teal-500 focus:ring-opacity-50 active:text-teal-600"
                      >
                        <svg
                          class="hi-solid hi-x inline-block w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          ><path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          /></svg
                        >
                      </button>
                    </div>
                    <!-- END Badge with close button -->
                  </div>
                {/each}
              </div>
            {/if}

            <div>
              <div class="space-y-1 mt-1">
                <div class="flex campaigns-center">
                  <input
                    bind:value={new_button}
                    class="block border border-gray-200 rounded-l z-1 py-2 px-3 leading-5 text-sm w-full active:z-1 focus:z-1 -mr-px focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    type="text"
                    id="tk-form-input-groups-append-button-secondary-small"
                    placeholder="Tombol Baru"
                  />
                  <button
                    type="button"
                    on:click={() => {
                      addButton();
                    }}
                    class="inline-flex justify-center campaigns-center space-x-2 border font-semibold focus:outline-none flex-none px-3 py-2 leading-5 text-sm rounded-r active:z-1 focus:z-1 border-indigo-200 bg-indigo-200 text-indigo-700 hover:text-indigo-700 hover:bg-indigo-300 hover:border-indigo-300 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-200 active:border-indigo-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-1 mt-3">
            <label class="font-medium" for="status">Status</label>
            <select
              bind:value={campaign.status}
              class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              id="status"
            >
              <option value="draft">Draft</option>
              <option value="sending">Kirim</option>
              <option value="stop">Stop</option>
              <option value="done">Selesai</option>
            </select>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="inline-flex  w-full justify-center items-center space-x-2 border font-semibold focus:outline-none px-4 py-3 leading-5 text-md rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
            >
              Simpan Pesan
            </button>
          </div>
        </form>

        <div />
      </div>
    </div>
  </TsLayouts>
</div>

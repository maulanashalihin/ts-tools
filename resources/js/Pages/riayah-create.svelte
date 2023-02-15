<script>
  import dayjs from "dayjs";
  import { inertia, Link, router } from "@inertiajs/svelte";
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/layouts.svelte";

  export let campaign = { 
  };

  let new_button;
  function saveMessage() {
    if (campaign.id) {
        router.put("/riayah/" + campaign.id, campaign);
      } else {
        router.post("/riayah", campaign);
      }
  }

 

  async function handleChange(e) {
    const file = e.target.files[0];
 
    campaign.filename = file.name 

    var formData = new FormData();

    formData.append("file", file);

    let url = "/riayah/upload";
 

axios
  .post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Filetype: "file",
    }
  })
  .then((response) => { 

    if (typeof response.data == "string") {
      campaign.file = response.data
    }
  });
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
          <div class="space-y-1 mt-3">
            <label class="font-medium" for="status">File</label>
          {#if campaign.file}
            <div class="border px-3 py-2 bg-white flex justify-between">
              {campaign.filename}
              <button on:click={()=>{campaign.file = null;campaign.filename = null;campaign=campaign;}}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              </button>
            </div>
          {:else}
          <input type="file" accept="image/*" on:change={handleChange}>
          {/if}
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

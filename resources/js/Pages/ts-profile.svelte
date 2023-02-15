<script>
  import dayjs from "dayjs";
  import { inertia, Link, router } from "@inertiajs/svelte";
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/ts-layouts.svelte";
  import Select from "../Components/Select.svelte";
  import cities from "../Components/kabupaten.json";

  let items = cities.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  export let user;

  function saveProfile() {
    router.post("/profile", user);
  }
</script>

<div>
  <TsLayouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <h1 class="text-2xl">Edit Profile</h1>
      <hr class="my-6" />
      <form
        on:submit|preventDefault={saveProfile}
        enctype="multipart/form-data"
        class="space-y-6"
      >
        <div class="space-y-1">
          <label class="font-medium" for="twitter_username"
            >Twitter Username</label
          >

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l text-gray-500"
            >
              @
            </div>
            <input
            required
              bind:value={user.twitter_username}
              class="block border border-gray-200 rounded pl-7 py-2 leading-5 text-sm w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="text"
              id="tk-form-input-groups-prepend-icon-inline-small"
              placeholder="islamictroops"
            />
          </div>
        </div>
        <div class="space-y-1">
          <label class="font-medium" for="name">Name</label>
          <input
            bind:value={user.name}
            required
            class="w-full block border border-gray-200 rounded px-3 py-2 leading-6 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            type="text"
            id="name"
            placeholder="Enter your Name"
          />
        </div>

        <div class="space-y-1">
          <label class="font-medium" for="city">Kabupaten</label>
          <Select bind:value={user.city} lists={items} />
        </div>

        <div class="text-right">
          <button class="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >Simpan</button
          >
        </div>
      </form>
    </div>
  </TsLayouts>
</div>

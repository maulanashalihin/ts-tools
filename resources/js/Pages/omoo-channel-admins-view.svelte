<script>
  import axios from "axios";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { validatePhone } from "../Components/helper";

  import Layouts from "../Components/layouts.svelte";

  export let channel = {
    avatar: "https://avatars.dicebear.com/api/initials/NN.svg",
    name: "",
    created: Date.now(),
  };

  export let admins;
</script>

<Layouts>
  <!-- Page Heading -->
  <div class="bg-white">
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div
        class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0"
      >
        <div class="grow">
          <h1 class="text-xl font-bold text-gray-700 mb-1">
            {#if channel.id}
              {channel.name}
            {:else}
              Buat Channel Baru
            {/if}
          </h1>
        </div>
      </div>
    </div>
  </div>
  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
    <div class="space-y-8">
      <!-- User Profile -->
      <div class="md:flex md:space-x-5">
        <!-- User Profile Info -->
        <div class="md:flex-none md:w-1/3 text-center md:text-left">
          <h3
            class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1"
          >
            <span>Channel</span>
          </h3>
          <p class="text-gray-500 text-sm mb-5">Detail Channel Anda</p>
        </div>
        <!-- END User Profile Info -->

        <!-- Card: User Profile -->
        <div
          class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3"
        >
          <!-- Card Body: User Profile -->
          <div class="p-5 lg:p-6 grow w-full">
            <div class="space-y-6">
              <div class="space-y-1">
                <div class="flex justify-center">
                  <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300"
                  >
                    <img class="rounded-full" src={channel.avatar} alt="" />
                  </div>
                </div>
              </div>

              <div class="space-y-1">
                <label for="name" class="font-medium">Nama Channel</label>
                <div class="text-gray-500">{channel.name}</div>
                <!-- <input readonly bind:value={channel.name} class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" type="text" id="name" placeholder="Dakwah Islam" /> -->
              </div>
            </div>
          </div>
          <!-- Card Body: User Profile -->
        </div>
        <!-- Card: User Profile -->
      </div>
      <!-- END User Profile -->
    </div>

    {#if channel.id}
      <div class="space-y-8 mt-10">
        <!-- User Profile -->
        <div class="md:flex md:space-x-5">
          <!-- User Profile Info -->
          <div class="md:flex-none md:w-1/3 text-center md:text-left">
            <h3
              class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1"
            >
              <span>Social Media URL</span>
            </h3>
            <p class="text-gray-500 text-sm mb-5">
              masukan url social media resmi channel anda
            </p>
          </div>
          <!-- END User Profile Info -->

          <!-- Card: User Profile -->
          <div class="flex flex-col      overflow-hidden md:w-2/3">
            <!-- Responsive Table Container -->
            <!-- Form Action with Input -->
            <div class="mb-3">
              <!-- Card -->
              <div
                class="flex flex-col rounded shadow-sm bg-white overflow-hidden"
              >
                <!-- Card Body -->
                <div
                  class="p-5 lg:p-6 grow w-full border-l-4 border-blue-500 space-y-6"
                >
                  <div class="space-y-1">
                    <label for="website_url" class="font-medium"
                      >Website URL</label
                    >
                    <div class="text-gray-500">
                      {channel.website_url || "belum ada"}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label for="ig_url" class="font-medium">Instagram URL</label
                    >
                    <div class="text-gray-500">
                      {channel.ig_url || "belum ada"}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label for="tiktok_url" class="font-medium"
                      >Tiktok URL</label
                    >
                    <div class="text-gray-500">
                      {channel.tiktok_url || "belum ada"}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label for="youtube_url" class="font-medium"
                      >Youtube URL</label
                    >
                    <div class="text-gray-500">
                      {channel.youtube_url || "belum ada"}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label for="facebook_url" class="font-medium"
                      >Facebook URL</label
                    >
                    <div class="text-gray-500">
                      {channel.facebook_url || "belum ada"}
                    </div>
                  </div>
                </div>
                <!-- END Card Body -->
              </div>
              <!-- END Card -->
            </div>
            <!-- END Form Action with Input -->

            <!-- END Responsive Table Container -->
          </div>
          <!-- Card: User Profile -->
        </div>
        <!-- END User Profile -->
      </div>
      <div class="space-y-8 mt-10">
        <!-- User Profile -->
        <div class="md:flex md:space-x-5">
          <!-- User Profile Info -->
          <div class="md:flex-none md:w-1/3 text-center md:text-left">
            <h3
              class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1"
            >
              <span>Admin</span>
            </h3>
            <p class="text-gray-500 text-sm mb-5">Pengurus Channel</p>
          </div>
          <!-- END User Profile Info -->

          <!-- Card: User Profile -->
          <div class="flex flex-col      overflow-hidden md:w-2/3">
            <!-- Responsive Table Container -->
            <!-- Form Action with Input -->

            <!-- END Form Action with Input -->
            <div
              class="border border-gray-200 rounded overflow-x-auto min-w-full bg-white"
            >
              <!-- Bordered Table -->
              <table class="min-w-full text-sm align-middle whitespace-nowrap">
                <!-- Table Header -->
                <thead>
                  <tr class="border-b border-gray-200">
                    <th
                      class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                    >
                      Avatar
                    </th>
                    <th
                      class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left"
                    >
                      Name
                    </th>

                    <th
                      class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <!-- END Table Header -->

                <!-- Table Body -->
                <tbody>
                  {#each admins as item}
                    <!-- content here -->
                    <tr class="border-b border-gray-200">
                      <td class="p-3 text-center">
                        <img
                          src="https://avatars.dicebear.com/api/initials/{encodeURIComponent(
                            item.twitter_username
                          )}.svg"
                          alt="User Avatar"
                          class="inline-block w-10 h-10 rounded-full"
                        />
                      </td>
                      <td class="p-3">
                        <p class="font-medium">
                          {item.twitter_username}
                        </p>
                      </td>

                      <td class="p-3 text-center">
                        {item.phone}
                      </td>
                    </tr>
                  {/each}
                </tbody>
                <!-- END Table Body -->
              </table>
              <!-- END Bordered Table -->
            </div>
            <!-- END Responsive Table Container -->
          </div>
          <!-- Card: User Profile -->
        </div>
        <!-- END User Profile -->
      </div>
    {/if}
  </div>
</Layouts>

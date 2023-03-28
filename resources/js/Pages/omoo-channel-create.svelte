<script>
  import { router } from "@inertiajs/svelte";
  import axios from "axios";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { validatePhone } from "../Components/helper";

  import Layouts from "./../Components/ts-layouts.svelte";

  export let channel = {
    avatar: "https://avatars.dicebear.com/api/initials/NN.svg",
    name: "",
    created: Date.now(),
  };
  export let user;

  let phone = user.phone;

  export let admins;

  let new_member;

  function addNewMember() {
    if (new_member) {
      axios
        .post(`/channel/${channel.id}/members`, {
          tg_id: new_member,
        })
        .then(
          (response) => {
            admins = [...admins, response.data];
          },
          (error) => {
            alert(error.response.data);
          }
        );
    }
  }

  function deleteMember(member) {
    if (member) {
      admins = admins.filter((item) => item.id != member.id);
      axios.delete(`/channel/${member.id}/members`);
    }
  }

  function changeAvatar() {
    if (channel.avatar.includes("avatars")) {
      channel.avatar = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
        channel.name
      )}.svg`;
    }
  }

  function saveChannel() {
    if (channel.id) {
      router.put("/channel/" + channel.id, channel);
    } else {
      if(user.phone)
      user.phone = validatePhone(user.phone)

      axios.post("/buzzer", user);
      router.post("/channel", channel);
    }
  }

  let uploadProgress = 0;

  function handleChange(e) {
    const file = e.target.files[0];

    var formData = new FormData();

    formData.append("file", file);

    let url = "/upload";

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Filetype: "avatar",
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
        },
      })
      .then((response) => {
        uploadProgress = 0;

        if (typeof response.data == "string") {
          channel.avatar = response.data;
        }
      });
  }
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
            <form
              on:submit|preventDefault={saveChannel}
               
              class="space-y-6"
            >
              <div class="space-y-1">
                <label for="avatar" class="font-medium">Photo</label>
                <div
                  class="sm:flex sm:items-center sm:space-x-4 space-y-4 sm:space-y-0"
                >
                  <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300"
                  >
                    <img class="rounded-full" src={channel.avatar} alt="" />
                  </div>
                  <label class="block">
                    <span class="sr-only">Choose profile photo</span>
                    <input
                      on:change={handleChange}
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      type="file"
                      id="photo"
                      name="photo"
                    />
                  </label>
                </div>
              </div>

              <div class="space-y-1">
                <label for="name" class="font-medium">Nama Channel <span class="text-red-500">*</span></label>
                <input
                  on:keyup={changeAvatar}
                  bind:value={channel.name}
                  class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="text"
                  id="name"
                  required
                  placeholder="Dakwah Islam"
                />
              </div>
              {#if !phone}
              <div class="space-y-1">
                <label for="phone" class="font-medium">No Whatsapp Admin <span class="text-red-500">*</span></label>
                <input
                  on:keyup={changeAvatar}
                  bind:value={user.phone}
                  required
                  class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="number"
                  id="phone"
                  placeholder="62813xxxxxxxx"
                />
              </div>
              {/if}
              <button
                type="submit"
                class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
              >
                Simpan
              </button>
            </form>
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
            <form class="mb-3" on:submit|preventDefault={saveChannel}>
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
                    <input
                      on:keyup={changeAvatar}
                      bind:value={channel.website_url}
                      class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      type="text"
                      id="website_url"
                      placeholder="https://mediaumat.id/"
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="ig_url" class="font-medium">Instagram URL</label
                    >
                    <input
                      on:keyup={changeAvatar}
                      bind:value={channel.ig_url}
                      class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      type="text"
                      id="ig_url"
                      placeholder="https://www.instagram.com/mediaumat/?hl=en"
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="tiktok_url" class="font-medium"
                      >Tiktok URL</label
                    >
                    <input
                      on:keyup={changeAvatar}
                      bind:value={channel.tiktok_url}
                      class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      type="text"
                      id="tiktok_url"
                      placeholder="https://www.tiktok.com/@mediaumat"
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="youtube_url" class="font-medium"
                      >Youtube URL</label
                    >
                    <input
                      on:keyup={changeAvatar}
                      bind:value={channel.youtube_url}
                      class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      type="text"
                      id="facebook_url"
                      placeholder="https://www.youtube.com/c/MediaUmatnews"
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="facebook_url" class="font-medium"
                      >Facebook URL</label
                    >
                    <input
                      on:keyup={changeAvatar}
                      bind:value={channel.facebook_url}
                      class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      type="text"
                      id="facebook_url"
                      placeholder="https://id-id.facebook.com/Tabloid.MU/"
                    />
                  </div>

                  <button
                    type="submit"
                    class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
                  >
                    Simpan
                  </button>
                </div>
                <!-- END Card Body -->
              </div>
              <!-- END Card -->
            </form>
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
            <form class="mb-3" on:submit|preventDefault={addNewMember}>
              <!-- Card -->
              <div
                class="flex flex-col rounded shadow-sm bg-white overflow-hidden"
              >
                <!-- Card Body -->
                <div
                  class="p-5 lg:p-6 grow w-full border-l-4 border-orange-300"
                >
                  <h3 class="text-lg font-semibold mb-1">Tambah Pengurus</h3>

                  <div
                    class="space-y-2 sm:space-y-0 sm:flex sm:space-x-2 md:w-1/2"
                  >
                  <input
                  bind:value={new_member}
                  class="block px-2 border border-gray-200 rounded py-2 leading-5 text-sm w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="text"
                  name="tg_id"
                  placeholder="Masukan Telegram ID"
                />
                    <button
                      type="submit"
                      class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-orange-200 bg-orange-200 text-orange-700 hover:text-orange-700 hover:bg-orange-300 hover:border-orange-300 focus:ring focus:ring-orange-500 focus:ring-opacity-50 active:bg-orange-200"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <!-- END Card Body -->
              </div>
              <!-- END Card -->
            </form>
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
                          {item.name} ({item.twitter_username})
                        </p>
                      </td>

                      <td class="p-3 text-center">
                        <button
                          on:click={() => {
                            deleteMember(item);
                          }}
                          type="button"
                          class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
                        >
                          <span>Hapus</span>
                        </button>
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

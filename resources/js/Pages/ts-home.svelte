<script>
  import dayjs from "dayjs";
  import { inertia, Link, router } from "@inertiajs/svelte";
  export let campaigns = [];
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/ts-layouts.svelte";
  import { t } from "../Language/lang";
  export let user;

  let profileModal = false;

  if (!user.twitter_username) {
    profileModal = true;
  }
  function saveProfile() {
    axios.post("/buzzer", user);
    profileModal = false;
    router.reload();
  }

  let timezone = "WIB";

  const offset = new Date().getTimezoneOffset();

  if (offset == -480) {
    timezone = "WITA";
  }

  if (offset == -540) {
    timezone = "WIT";
  }

  campaigns.forEach((item) => {
    if (
      Date.now() > item.time &&
      (item.status == "tweet submission" || item.status == "waiting")
    ) {
      axios.put("/start-campaign/" + item.id);
      item.status = "running";
      campaigns = campaigns;
    }

    if (Date.now() > item.end_time && item.status == "running") {
      axios.put("/end-campaign/" + item.id);
      item.status = "done";
      campaigns = campaigns;
    }

    if (Date.now() < item.end_time && item.status == "running") {
      item.is_countddown = true;
      setInterval(() => {
        var distance = item.end_time - Date.now();
        item.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        item.hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        item.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        item.seconds = Math.floor((distance % (1000 * 60)) / 1000);

        campaigns = campaigns;
      }, 1000);
    }
  });
</script>

<div>
  <TsLayouts>
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <!--
      
            ADD YOUR MAIN CONTENT BELOW
      
            -->

      {#if campaigns.length}
        <div class="grid lg:grid-cols-3 gap-3 lg:gap-6">
          {#each campaigns as item}
            <!-- content here -->
            <Link
              href="/c/{item.id}"
              class="rounded-lg bg-white  justify-between p-4 sm:p-5"
            >
              <div class="flex items-center space-x-4">
                <div>
                  <h3
                    class="text-lg font-medium text-slate-700 dark:text-navy-100"
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-xs+">{dayjs(item.time).format("DD MMM YYYY")}</p>
                <p
                  class="text-xl font-medium text-slate-700 dark:text-navy-100"
                >
                  {dayjs(item.time).format("HH:mm")}
                  {timezone} - {dayjs(item.end_time).format("HH:mm")}
                  {timezone}
                </p>
                <div class="text-md">
                  {item.hashtags}
                </div>
                <div class="mt-5  ">
                  <div class="  text-sm">
                    {#if item.status == "running"}
                      diikuti oleh {item.attendee || 0} orang

                      <div
                        class="w-full bg-orange-600 text-white mt-1 rounded px-2 py-2 text-center"
                      >
                        TWEET STORM SEKARANG
                      </div>
                    {:else if item.status == "tweet submission"}
                      <div
                        class="p-4 md:p-5 rounded flex justify-between text-gray-700 bg-gray-100"
                      >
                        Yuk kontribusi memberikan kata-kata hebat anda agar TS
                        kali ini bisa viral dan mengguncang dunia.
                      </div>
                      <div
                        class="w-full bg-indigo-600 text-white mt-1 rounded px-2 py-2 text-center"
                      >
                        TULIS SHORT TWEET
                      </div>
                    {/if}
                  </div>
                </div>
                <div class="flex justify-center gap-1 mt-3">
                  {#if item.is_countddown}
                    <div
                      class="h-10 bg-indigo-600 text-white rounded px-2 flex items-center"
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
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  {/if}

                  {#if item.hours}
                    <div
                      class="h-10 bg-indigo-600 text-white rounded px-2 flex items-center"
                    >
                      {item.hours}
                      {t("jam")}
                    </div>
                  {/if}
                  {#if item.minutes}
                    <div
                      class="h-10 bg-indigo-600 text-white rounded px-2 flex items-center"
                    >
                      {item.minutes}
                      {t("mnt")}
                    </div>
                  {/if}
                  {#if item.seconds}
                    <div
                      class="h-10 bg-indigo-600 text-white rounded px-2 flex items-center"
                    >
                      {item.seconds}
                      {t("dtk")}
                    </div>
                  {/if}
                </div>
              </div>
            </Link>
          {/each}
        </div>
      {:else}
        <div class="text-gray-500 text-center">
          {t("Belum ada Campaign")}.
        </div>
      {/if}

      <!--
            
            ADD YOUR MAIN CONTENT ABOVE
                  
            -->
    </div>
  </TsLayouts>
  <Modal title="Profil Twitter" bind:show={profileModal}>
    <form on:submit|preventDefault={saveProfile}>
      <!-- Card -->
      <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
        <!-- Card Body -->
        <div class="p-5 lg:p-6 grow w-full border-l-4 border-orange-300">
          <h3 class="text-lg font-semibold mb-1">Twitter Username</h3>
          <div class=" ">
            <input
              bind:value={user.twitter_username}
              class="block border px-3 border-gray-200 rounded py-2 leading-5 text-sm w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              type="text"
              placeholder="islamictroops"
            />
            <div class="text-gray-500">
              <small
                >{t(
                  "tambahkan username twitter (tanpa @) agar sesama troops bisa saling follow"
                )}</small
              >
            </div>
            <button
              type="submit"
              class="mt-3 block inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-orange-200 bg-orange-200 text-orange-700 hover:text-orange-700 hover:bg-orange-300 hover:border-orange-300 focus:ring focus:ring-orange-500 focus:ring-opacity-50 active:bg-orange-200"
            >
              {t("Simpan")}
            </button>
          </div>
        </div>
        <!-- END Card Body -->
      </div>
      <!-- END Card -->
    </form>
  </Modal>
</div>

<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";

  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/layouts.svelte";
  import Carousel from "../Components/Carousel.svelte";

  export let contents;
  contents.forEach((item) => {
    if (item.type == "slide") {
      item.images_url = JSON.parse(item.images_url);
    }
  });
  contents = contents;

  function UpdateStatus(post, status) {
    post.status = status;
    axios.put("/omoo-contents/" + post.id, { status: status });
    contents = contents;
  }

  const statusColor = {
    pending: "bg-gray-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  };

  let current = 'semua';

</script>

<div>
  <TsLayouts>
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div class="text-xl font-medium">Konten Omoo</div>

      <div id="button-group" class="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">



        <a href="/omoo-contents" use:inertia>
          <button
          class="{current === 'semua' ? 'btngroup-select' : 'btngroup-unselect'}"
	        on:click="{() => current = 'semua'}"
        >
          Semua
        </button>
        </a>
        
        <a href="/omoo-contents/pending" use:inertia>
          <button
          class="{current === 'pending' ? 'btngroup-select' : 'btngroup-unselect'}"
	        on:click="{() => current = 'pending'}"
        >
          Pending
        </button>
        </a>

        <a href="/omoo-contents/approved" use:inertia>
          <button
          class="{current === 'approved' ? 'btngroup-select' : 'btngroup-unselect'}"
	        on:click="{() => current = 'approved'}"
        >
          Approved
        </button>
        </a>
      
        <a href="/omoo-contents/rejected" use:inertia>
          <button
          class="{current === 'rejected' ? 'btngroup-select' : 'btngroup-unselect'}"
	        on:click="{() => current = 'rejected'}"
        >
          Rejected
        </button>
        </a>

      </div>
      

      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5">
        {#each contents as item}
          <!-- content here -->
          <div class="bg-white rounded  ">
            <div class="px-3 py-2 flex gap-3">
              <img
                class="w-10 h-10 rounded-full"
                src={item.channel_avatar}
                alt=""
              />
              <div class="flex items-center">
                {item.channel_name}
              </div>
            </div>
            <div class="relative">
              {#if item.type == "image"}
                <img src={item.images_url} alt="" />
              {/if}
              {#if item.type == "slide"}
                <Carousel images={item.images_url} />
              {/if}

              {#if item.type == "video"}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video
                  controls
                  poster={item.thumbnail ||
                    "https://cdn.dribbble.com/users/17914/screenshots/4902225/media/0d6d47739dae97adc81ca7076ee56cc9.png?compress=1&resize=400x300"}
                >
                  <source src={item.video_url} type="video/mp4" />
                  <source src="movie.ogg" type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              {/if}

              <div class="absolute top-4 flex gap-1 left-4 ">
                {#if item.is_omoo}
                  <span
                    class="{statusColor[
                      item.status
                    ]} text-white px-3 rounded-full flex gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-5 h-5 mt-0.5 text-white"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>omoo</span>
                  </span>
                {/if}
                <span
                  class="{statusColor[
                    item.status
                  ]} text-white px-3 rounded-full"
                >
                  {item.status}
                </span>
              </div>
            </div>
            <div class="p-3">
              <div class="text-sm text-gray-500 whitespace-pre-line">
                {item.caption}
              </div>
              <div class="flex justify-center gap-3 mt-3">
                <div class="inline-flex">
                  <button
                    on:click={() => {
                      UpdateStatus(item, "pending");
                    }}
                    type="button"
                    class="{item.status == 'pending'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100'}   -mr-px border px-2 py-1 border "
                  >
                    pending
                  </button>
                  <button
                    on:click={() => {
                      UpdateStatus(item, "approved");
                    }}
                    type="button"
                    class="{item.status == 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-gray-100'}    border px-2 py-1 border"
                  >
                    approve
                  </button>
                  <button
                    on:click={() => {
                      UpdateStatus(item, "rejected");
                    }}
                    type="button"
                    class="{item.status == 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'hover:bg-gray-100'}  -ml-px  border px-2 py-1 border"
                  >
                    reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </TsLayouts>
</div>

<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";

  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/ts-layouts.svelte";
  import StratAlert from "../Components/StratAlert.svelte";
  import Carousel from "../Components/Carousel.svelte";

  export let channel;
  export let strat = {};
  export let contents;

  contents.forEach((item) => {
    if (item.type == "slide") {
      item.images_url = JSON.parse(item.images_url);
    }
  });
  contents = contents;

  function deletePost(channelId, postId) {
  return function () {
    const confirmDelete = confirm("Yakin hapus konten ini?");
    if (confirmDelete) {
      axios.delete("/channel/" + channelId + "/content/" + postId)
        .then(() => {
          contents = contents.filter((item) => item.id != postId);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
}

  const statusColor = {
    pending: "bg-gray-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  };
</script>

<div>
  <TsLayouts>
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <StratAlert {strat} />
      <div class="text-xl font-medium">
        {channel.name}
      </div>
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5 h-32">
        <a
          use:inertia
          class="border-2   rounded text-center flex justify-center items-center"
          href="{channel.id}/content/create"
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
            <div>Tambah Post Baru</div>
          </div>
        </a>
        {#each contents as item}
          <!-- content here -->
          <div class="bg-white rounded  ">
            <div class=" ">
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
            </div>
            <div class="p-3 ">
              <div class="mb-2">
                <span
                  class=" {statusColor[
                    item.status
                  ]} text-white  px-3 py-1  rounded-full"
                >
                  {item.status}
                </span>
              </div>
              <div class="text-sm text-gray-500 whitespace-pre-line">
                {item.caption}
              </div>

              <div class="flex justify-center gap-10 mt-3">
                <a use:inertia href="{channel.id}/content/{item.id}/edit"
                class="font-semibold inline-flex px-3 py-1 leading-4 rounded-md bg-cyan-200 text-cyan-800" >Edit</a
                >
                <button on:click={deletePost(channel.id, item.id)} class="font-semibold inline-flex px-3 py-1 leading-4 rounded-md bg-red-200 text-red-800">Delete</button
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </TsLayouts>
</div>

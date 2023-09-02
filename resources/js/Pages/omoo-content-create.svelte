<script>
  import { inertia, router } from "@inertiajs/svelte";
  import axios from "axios";
  import dayjs from "dayjs";
  import { onMount } from "svelte";

  import Layouts from "./../Components/ts-layouts.svelte";
  import StratAlert from "../Components/StratAlert.svelte";
  import Dropzone from "../Components/Dropzone.svelte";

  export let channel;
  export let strat;

  export let content = {
    channel_id: channel.id,
    channel_name: channel.name,
    channel_avatar: channel.avatar,
    type: "text",
    caption: "",
    created: Date.now(),
  };

  function saveContent() {
    if (content.type == "slide") {
      content.images_url = JSON.stringify(content.images_url);
    }
    if (channel.official) {
      content.category = "Official";
      content.status = "approved";
    }
    if (content.id) {
      axios.put(`/channel/${channel.id}/content/${content.id}`, content);
    } else {
      router.post(`/channel/${channel.id}/content`, content);
    }
  }

  let uploadProgress = 0;

  async function handleChange(files) { 

    let type = files[0].type.split("/")[0];

    let slides_urls = [];

    if (files.length > 1) {
      type = "slide";
    }

    for await (const file of files) {
      var formData = new FormData();

      formData.append("file", file);

      let url = "/upload";

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Filetype: type,
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
            if (type == "image")
              if (file.type.split("/")[0] == "image") {
                if (content.type == "video") {
                  content.thumbnail = response.data;
                  return;
                }
                content.images_url = response.data;
                content.type = type;
              }

            if (type == "slide") {
              slides_urls.push(response.data);
              content.images_url = slides_urls;
              content.type = type;
            }

            if (type == "video") {
              content.video_url = response.data;
              content.type = type;
            }
            console.log(content.type);
          }
        });
    }
  }
</script>

<Layouts>
  <!-- Page Heading -->
  <div class="bg-white">
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div class=" text-center">
        <div>
          <div class="flex justify-center">
            <img class="w-16 h-16 rounded-full" src={channel.avatar} alt="" />
          </div>
          <div class="text-2xl mt-3">{channel.name}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container max-w-xl mx-auto p-4 lg:p-8">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if content.type == "text" && uploadProgress == 0}
      <Dropzone on:change={(e)=>{handleChange(e.detail)}} subtitle="Upload Gambar/Carousel/Video"></Dropzone>
    {/if}

    {#if uploadProgress}
      <!-- Progress Bar: Stacked With Heading -->
      <div class="space-y-1">
        <h3 class="font-semibold">Upload Progress</h3>
        <div
          class="flex items-center w-full h-5 bg-teal-100 rounded-lg overflow-hidden"
        >
          <div
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
            class="flex items-center justify-center self-stretch transition-all duration-500 ease-out bg-teal-500 text-white text-sm font-semibold"
            style="width: {uploadProgress}%;"
          >
            {uploadProgress}%
          </div>
        </div>
      </div>
      <!-- END Progress Bar: Stacked With Heading -->
    {/if}
    <input
      type="file"
      accept="image/png, image/jpeg, video/*"
      id="uploader"
      on:change={handleChange}
      multiple
      class="hidden"
    />

    {#if content.type == "image"}
      <img src={content.images_url} class="w-full" alt="Content of Images" />
    {/if}

    {#if content.type == "slide"}
      <div class="flex px-1 gap-3 w-full overflow-auto">
        {#each content.images_url as url}
          <div>
            <img class="h-20" src={url} alt="" />
            <div>
              <button
                on:click={() => {
                  content.images_url = content.images_url.filter(
                    (item) => item != url
                  );
                }}>Hapus</button
              >
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if content.type == "video"}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video class="w-full" controls>
        <source src={content.video_url} type="video/mp4" />
        Your browser does not support HTML video.
      </video>

      {#if content.thumbnail}
        <img
          src={content.thumbnail}
          class="w-full mt-8"
          alt="Video Thumbnail"
        />
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
       <div class="mt-4">
        <Dropzone on:change={(e)=>{handleChange(e.detail)}}   subtitle="Upload Thumbnail Video"></Dropzone>
       </div>
      {/if}
    {/if}

    <form on:submit|preventDefault={saveContent}>
      <div class="mt-6">
        <label class="font-medium" for="caption">Caption</label>
        <textarea
          bind:value={content.caption}
          class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          id="caption"
          rows="4"
          placeholder="Description of the post"
        />
      </div>
      <div class="mt-6">
        
        {#if strat}
          <div class="mt-2">
            <StratAlert {strat} />
          </div>
        {/if}
      </div>

      {#if channel.official == false}
        <div class="mt-4">
          <label class="font-medium" for="tk-inputs-default-select"
            >Kategori</label
          >

          <select
            bind:value={content.category}
            class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            id="tk-inputs-default-select"
          >
            <option>Politik</option>
            <option>Ekonomi</option>
            <option>Ulama</option>
            <option>Muslimah</option>
            <option>Mahasiswa</option>
          </select>
        </div>
      {/if}
      <div class="mt-4">
        <button class="w-full bg-orange-500 text-white py-2">Simpan</button>
      </div>
      <div class="text-center text-sm mt-3 text-gray-500">
        <a use:inertia href="/channel/{channel.id}">Kembali</a>
      </div>
    </form>
    <!-- END Textarea -->
  </div>
</Layouts>

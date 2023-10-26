<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import Layouts from "../Components/layouts.svelte";

  export let campaign;

  export let medias = [];

  let new_tweet = "";

  let tweet_id = "";

  function saveTweet() {
    axios
      .post("/media", { tweet_id, campaign_id: campaign.id })
      .then((response) => {
        medias = [response.data, ...medias];
        tweet_id = "";
      });
  }

  let pathname = "media";

  function deleteItem(item) {
    medias = medias.filter((i) => i.id != item.id);
    axios.delete("/media/" + item.id);
  }
</script>

<div>
  <Layouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <div>
        <h1 class="text-2xl">
          {campaign.title}
        </h1>
        <div>
          {@html campaign.description}
        </div>
        <br />
        <div>
          <label class="font-bold " for="description"> Hestek Campaign </label>
        </div>
        <div>
          {campaign.hashtags}
        </div>
      </div>

      <div class="grid gap-4 mb-3 mt-6">
        <p>Pilih Tweet untuk dipakai medianya</p>
      </div>
      <form on:submit|preventDefault={saveTweet} class="space-y-6">
        <div class="space-y-1">
          <label class="font-medium" for="tweet_id">Tweet ID</label>
          <input
            required
            bind:value={tweet_id}
            class="w-full block border border-gray-200 rounded px-3 py-2 leading-6 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            type="text"
            id="tweet_id"
            placeholder="1587098878763233286"
          />
        </div>
        <div class="text-right">
          <button class="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >Kirim</button
          >
        </div>
      </form>
    </div>

    <div class="container my-3 grid gap-3  lg:my-6 max-w-lg mx-auto ">
      <!-- Pill Tabs -->
      <nav class="flex items-center space-x-1 md:space-x-2">
        <a
          use:inertia
          href="onreview-tweets"
          class={pathname.includes("onreview-tweets")
            ? "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100"
            : "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent"}
        >
          On Review
        </a>
        <a
          use:inertia
          href="all-tweets"
          class={pathname.includes("all-tweets")
            ? "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100"
            : "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent"}
        >
          All Tweets
        </a>
        <a
          use:inertia
          href="tweet-buzz"
          class={pathname.includes("tweet-buzz")
            ? "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100"
            : "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent"}
        >
          Tweet Buzz
        </a>
        <a
          use:inertia
          href="media"
          class={pathname.includes("media")
            ? "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-indigo-500 bg-indigo-100"
            : "px-3 md:px-5 font-medium flex items-center space-x-2 py-2 rounded text-gray-500 hover:text-indigo-500 hover:bg-indigo-100 active:bg-transparent"}
        >
          Media
        </a>
      </nav>
      <!-- END Pill Tabs -->

      {#each medias as item}
        <!-- content here -->
        <div class="">
          <img alt="Media" src={item.media_url} />
          <button
            on:click={() => {
              deleteItem(item);
            }}
            class="text-gray-500 text-xs">hapus</button
          >
        </div>
      {/each}
    </div>
  </Layouts>
</div>

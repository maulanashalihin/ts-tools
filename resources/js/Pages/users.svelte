<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import axios from "axios";
  import Layouts from "../Components/layouts.svelte";
  export let users;

  function deleteItem(item) {
    const check = confirm(
      `Apakah kamu yakin akan menghapus user ${item.name}?`
    );
    if (check) {
      users = users.filter((user) => user.id !== item.id);
      axios.delete("/users/" + item.id);
    }
  }

</script>

<div>
  <Layouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <div class="flex justify-between">
        <h1 class="text-2xl">User</h1>
        <a
          use:inertia
          href="/users/create"
          class="px-2 py-1 border border-gray-200 text-sm inline-flex gap-1"
        >
          User Baru</a
        >
      </div>
      <hr class="my-6 " />
      <div class="grid gap-3">
  {#each users as item}
    <div class="flex justify-between items-center">
      <div>
        {item.name}
        <span class="text-gray-400 text-xs ml-2">
          {item.email}
        </span>
      </div>
      <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-sm" on:click={() => deleteItem(item)}>Delete</button>
    </div>
  {/each}
</div>
    </div>
  </Layouts>
</div>

<script>
  import dayjs from "dayjs";
  import { inertia, Link, router } from "@inertiajs/svelte";
  import axios from "axios";
  import TsLayouts from "../Components/layouts.svelte";
  export let users = {};

  function saveUser() {
    if (users.id) {
      router.put("/users/" + users.id, users);
    } else {
      router.post("/users", users);
    }
  }
</script>

<div>
  <TsLayouts>
    <div class="container lg:mt-6 max-w-lg mx-auto bg-white p-4 lg:p-8">
      <div class="flex justify-between">
        <h1 class="text-2xl">User baru</h1>
      </div>
      <hr class="my-6" />

      <!-- Labels On Top Form Layout -->
      <form on:submit|preventDefault={saveUser} class="space-y-6">
        <div class="space-y-1">
          <label for="name" class="font-medium">Name</label>
          <input
            bind:value={users.name}
            class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
            type="text"
            id="name"
            placeholder="Enter your name.."
          />
        </div>
        <div class="space-y-1">
          <label for="email" class="font-medium">Email</label>
          <input
            bind:value={users.email}
            class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
            type="email"
            id="email"
            placeholder="Enter your email.."
          />
        </div>
        <div class="space-y-1">
          <label for="password" class="font-medium">Password</label>
          <input
            bind:value={users.password}
            class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
            type="password"
            id="password"
            placeholder="Enter your password.."
          />
        </div>
        <button
          type="submit"
          class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-amber-700 bg-amber-700 text-white hover:text-white hover:bg-amber-800 hover:border-amber-800 focus:ring focus:ring-amber-500 focus:ring-opacity-50 active:bg-amber-700 active:border-amber-700"
        >
          Buat Akun
        </button>
      </form>
      <!-- END Labels On Top Form Layout -->
    </div>
  </TsLayouts>
</div>

<script>
  import { inertia, router } from "@inertiajs/svelte";
  import { validatePhone } from "../Components/helper";

  let phone;
  let form = {
    phone: "",
  };

  export let errors;

  function login() {
    form.phone = validatePhone(phone);
    router.post("/ts-login", form);
  }
</script>

<!-- Page Container -->
<div
  id="page-container"
  class="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
>
  <!-- Page Content -->
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <div
      class="min-h-screen flex items-center justify-center relative overflow-hidden max-w-10xl mx-auto p-4 lg:p-8 w-full"
    >
      <!-- Patterns Background -->
      <div
        class="pattern-dots-md text-gray-300 absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-16 translate-y-16"
      />
      <div
        class="pattern-dots-md text-gray-300 absolute bottom-0 left-0 w-32 h-32 lg:w-48 lg:h-48 transform -translate-x-16 -translate-y-16"
      />
      <!-- END Patterns Background -->

      <!-- Sign In Section -->
      <div class="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1
            class="text-4xl font-bold inline-flex items-center mb-1 space-x-3"
          >
            <svg
              class="hi-solid hi-cube-transparent inline-block w-8 h-8 text-indigo-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                clip-rule="evenodd"
              /></svg
            >
            <span>Welcome Troopers</span>
          </h1>
          <p class="text-gray-500">Welcome, please sign in to your dashboard</p>
        </div>
        <!-- END Header -->

        <!-- Sign In Form -->
        <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
          <div class="p-5 lg:p-6 grow w-full">
            <div class="sm:p-5 lg:px-10 lg:py-8">
              <form on:submit|preventDefault={login} class="space-y-6">
                {#if errors}
                  <!-- Warning Alert -->
                  <div class="p-4 md:p-5 rounded text-orange-700 bg-orange-100">
                    <div class="flex items-center">
                      <svg
                        class="hi-solid hi-exclamation inline-block w-5 h-5 mr-3 flex-none text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        /></svg
                      >
                      <h3 class="font-semibold grow">
                        {errors}
                      </h3>
                    </div>
                  </div>
                  <!-- END Warning Alert -->
                {/if}
                <div class="space-y-1">
                  <label for="phone" class="font-medium">No Whatsapp</label>
                  <input
                    bind:value={phone}
                    class="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    type="number"
                    id="phone"
                    placeholder="081351941220"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- END Sign In Form -->

        <!-- Footer -->

        <!-- END Footer -->
      </div>
      <!-- END Sign In Section -->
    </div>
  </main>
  <!-- END Page Content -->
</div>
<!-- END Page Container -->

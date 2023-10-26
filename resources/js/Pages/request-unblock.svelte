<script>
  import { inertia, router } from "@inertiajs/svelte";
  import { validatePhone } from "../Components/helper";
 
  let phone;
  let form = {
    phone: "",
  };

 
  function login() {
    form.phone = validatePhone(phone);
    router.post("/request-unblock", form);
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
            
            <span>Request Unblock Akun</span>
          </h1>
          <p class="text-gray-500 text-lg">Silakan isi form di bawah untuk meminta pembukaan blokir</p>
        </div>
        <!-- END Header -->

        <!-- Sign In Form -->
        <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
          <div class="p-5 lg:p-6 grow w-full">
            <div class="sm:p-5 lg:px-10 lg:py-8">
              <form on:submit|preventDefault={login} class="space-y-6">
                 
                <div class="space-y-1">
                  <label for="name" class="font-medium">Nama</label>
                  <input
                    bind:value={form.name}
                    class="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    type="text"
                    id="name"
                    required
                    placeholder="Abdullah"
                  />
                </div>
                
                <div class="space-y-1">
                  <label for="phone" class="font-medium">No Whatsapp</label>
                  <input
                    bind:value={phone}
                    class="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    type="number"
                    id="phone"
                    required
                    placeholder="081351941xxx"
                  />
                </div>
                
                <div class="space-y-1">
                  <label for="tg_id" class="font-medium">TG ID</label>
                  <input
                    bind:value={form.tg_id}
                    class="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    type="number"
                    id="tg_id"
                    required
                    placeholder="10000000"
                  />
                  <div>
                    <small>ID telegram anda. silakan check di BOT</small>
                  </div>
                </div>
                <div class="space-y-1">
                  <label for="name" class="font-medium">Berikan alasan mengapa blokir perlu dicabut</label>
                   
                  <textarea  required bind:value={form.reason} class="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" name="reason" id="reason" cols="30" rows="3"></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
                  >
                    SUBMIT
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

<script>
  import { inertia, router } from "@inertiajs/svelte";
  import axios from "axios";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { v4 } from "uuid";
  import Layouts from "./../Components/layouts.svelte";

  export let content = {};

  let uploadProgress = {};
  let files = [];

  if (content.files) {
    files = JSON.parse(content.files);
  }

  function saveContent() {}

  function UpdateStatus(status) {
    content.status = status;
    axios.put("/bank-tsaqofah/" + content.id + "/status", { status: status }); 
  }
</script>

<Layouts>
  <!-- Page Heading -->

  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container bg-white md:mt-6 max-w-xl mx-auto  ">
    <div>
      <img src={content.thumbnail || "/THUMBNAIL.jpg"} alt="Thumbnail" />
    </div>
    <div class="p-5">
        <div class="space-y-2">
            <h1 class="font-bold text-xl">{content.title}</h1>
            <div>
              {content.content}
            </div>
          </div>
      
          <div class="mt-10">
            <label class="font-medium " for="title">Lampiran</label>
            <div class="grid grid-cols-4 gap-3 my-3">
              {#each files as file}
                <a
                  href={file.file}
                  target="_blank"
                  rel="noreferrer"
                  class="text-red-500"
                >
                  <div class="relative">
                    {#if file.progress == 100 && ["png", "jpg", "jpeg"].includes(file.type)}
                      <img src={file.file} alt={file.name} />
                    {/if}
                    {#if file.progress == 100 && ["pdf"].includes(file.type)}
                      <img src="/pdf.png" alt={file.name} />
                    {/if}
                    {#if file.progress == 100 && ["ppt", "pptx"].includes(file.type)}
                      <img src="/ppt.png" alt={file.name} />
                    {/if}
                    {#if file.progress == 100 && ["doc", "docx"].includes(file.type)}
                      <img src="/doc.png" alt={file.name} />
                    {/if}
                    {#if file.progress < 100}
                      <div class="flex justify-center">
                        <div class="relative">
                          <svg
                            aria-hidden="true"
                            class="mr-2 h-20 w-20 animate-spin fill-orange-600 text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <div class="absolute top-7 left-6">{file.progress}%</div>
                        </div>
                      </div>
                    {/if}
      
                    <div class="absolute top-1 left-1" />
                    <div class="text-center mt-1">
                      {file.name}
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
    </div>

    <!-- END Textarea -->
  </div>

  <div class="flex justify-center gap-3 mt-3">
    <div class="inline-flex">
      <button
        on:click={() => {
          UpdateStatus( "in review");
        }}
        type="button"
        class="{content.status == 'in review'
          ? 'bg-gray-500 text-gray-200'
          : 'hover:bg-gray-100'}   -mr-px border px-2 py-1 border "
      >
        in review
      </button>
      <button
        on:click={() => {
          UpdateStatus("published");
        }}
        type="button"
        class="{content.status == 'published'
          ? 'bg-green-100 text-green-700'
          : 'hover:bg-gray-100'}    border px-2 py-1 border"
      >
      published
      </button>
      <button
        on:click={() => {
          UpdateStatus("rejected");
        }}
        type="button"
        class="{content.status == 'rejected'
          ? 'bg-red-100 text-red-700'
          : 'hover:bg-gray-100'}  -ml-px  border px-2 py-1 border"
      >
        reject
      </button>
    </div>
  </div>

</Layouts>

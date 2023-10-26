<script>
  import { inertia, router } from "@inertiajs/svelte";
  import axios from "axios";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import {v4} from "uuid";
  import Layouts from "./../Components/ts-layouts.svelte";

  export let content = {};

 

  let uploadProgress = {};
  let files = [];

  if(content && content.files)
  {
    files = JSON.parse(content.files);
  }

  function saveContent() {
    
     if(files.length)
     {
        content.files = JSON.stringify(files)

        if (content.id) {
        axios.put(`/bank-tsaqofah/${content.id}`, content);
        } else {
        router.post(`/bank-tsaqofah`, content);
        }
     }

     
   }

  function deleteFile(file)
  {
    files = files.filter(item=>{
        return item.uuid != file.uuid;
    })
  }

  function uploadThumb(e)
  {
    const file = e.target.files[0]

    var formData = new FormData();

    formData.append("file", file); 

    axios
        .post("/tsq-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(response=>{
            if (typeof response.data == "string") { 
                content.thumbnail = response.data; 
            }
        })


  }

  async function handleChange(e) {
    const _files = e.target.files;
     

    for await (const file of _files) {
  
        const names = file.name.split(".");

        let data = {
            progress : 0, 
            uuid : v4(),
            size : file.size,
            name : file.name,
            type : names[names.length-1]
        }
        files.push(data)
        files = files;
 

      var formData = new FormData();

      formData.append("file", file);
      formData.append("uuid", data.uuid)
      formData.append("folder", "bank-tsaqofah")

      let url = "/upload";

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            data.progress = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            files = files;
          },
        })
        .then((response) => {
            
           
           

          if (typeof response.data == "string") { 
            data.file = response.data;
            files = files;
          }
        });

         
    }
     
  }
</script>

<Layouts>
  <!-- Page Heading -->

  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container max-w-xl mx-auto p-4 lg:p-8">

    <div class="grid grid-cols-3 gap-3 my-3">
        {#each files as file}
            <div class="relative">
               
                {#if file.progress == 100 && ['png','jpg','jpeg'].includes(file.type)}
                    <img src="{file.file}" alt="{file.name}" />
                {/if} 
                {#if file.progress == 100 && ['pdf'].includes(file.type)}
                    <img src="/pdf.png" alt="{file.name}" />
                {/if} 
                {#if file.progress == 100 && ['ppt','pptx'].includes(file.type)}
                    <img src="/ppt.png" alt="{file.name}" />
                {/if}
                {#if file.progress == 100 && ['doc','docx'].includes(file.type)}
                    <img src="/doc.png" alt="{file.name}" />
                {/if}
                {#if file.progress < 100}
                <div class="flex justify-center">
                    <div class="relative">
                        <svg aria-hidden="true" class="mr-2 h-20 w-20 animate-spin fill-orange-600 text-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <div class="absolute top-7 left-6">{file.progress}%</div>
                      </div>
                </div>
                  
                {/if}
                
                <div class="absolute top-1 left-1">
                    <button on:click={()=>{deleteFile(file)}} class="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                          </svg>
                          
                          
                    </button>
                </div>
                <div class="text-center mt-1">
                    {file.name}
                </div>
            </div>
        {/each}
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        on:click={() => {
          document.querySelector("#uploader").click();
        }}
        class="border-4 cursor-pointer border-dashed p-6 flex justify-center"
      >
        <div>
          <div class="flex justify-center">
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div class="text-center mt-3">Upload PDF, Doc, PPT, Gambar</div>
        </div>
      </div>

     
    <input
      type="file"
      accept="image/*,.doc, .docx,.ppt, .pptx,.pdf"
      id="uploader"
      on:change={handleChange}
      multiple
      class="hidden"
    />
    <input
      type="file"
      accept="image/*"
      id="thumbnail"
      on:change={uploadThumb} 
      class="hidden"
    />
 

    <form class="mt-6 space-y-4" on:submit|preventDefault={saveContent}>
      <div class="space-y-1">
        <label class="font-medium" for="title">Title</label>
        <input
        bind:value={content.title}
          class="w-full block border border-gray-200 rounded px-3 py-2 leading-6 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          type="text"
          id="title"
          placeholder="Tambahkan Judul"
        />
      </div>
      <div>
        <label class="font-medium" for="caption">Konten</label>
        <textarea
          bind:value={content.content}
          class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          id="caption"
          rows="4"
          placeholder="Tambahkan Konten Tsaqofah atau penjelasan tentang files "
        />
      </div>
      <div class="space-y-1">

        {#if content.thumbnail}
            <label class="font-medium" for="caption">Thumbnail</label>
            <div>
                <img src="{content.thumbnail}" alt="Thumbnail">
            </div>
        {/if}
      </div>
      <div class="space-y-2">
        <label class="font-medium" for="caption">Tambahkan Thumbnail</label>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          on:click={() => {
            document.querySelector("#thumbnail").click();
          }}
          class="border-4 cursor-pointer border-dashed p-6 flex justify-center"
        >
          <div>
            <div class="flex justify-center">
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div class="text-center mt-3">Thumbnail Konten</div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button class="w-full bg-orange-500 text-white py-2">Simpan</button>
      </div>
      <div class="text-center text-sm mt-3 text-gray-500">
        <a use:inertia href="/bank-tsaqofah">Kembali</a>
      </div>
    </form>
    <!-- END Textarea -->
  </div>
</Layouts>

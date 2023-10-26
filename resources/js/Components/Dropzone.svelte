<script>
  import { onMount } from "svelte";


  import { createEventDispatcher } from "svelte";
 
    const dispatchEvent = createEventDispatcher();

  export let files;
  export let subtitle;

  function onClickUpload(e) {
    files = e.target.files;

    dispatchEvent("change",files); 
  }

  onMount(() => {
    setTimeout(() => {
      var dropzone = document.getElementById("dropzone");
      if (dropzone) {
        var dropzone_input = dropzone.querySelector(".dropzone-input");

        [
          "drag",
          "dragstart",
          "dragend",
          "dragover",
          "dragenter",
          "dragleave",
          "drop",
        ].forEach(function (event) {
          dropzone.addEventListener(event, function (e) {
            e.preventDefault();
            e.stopPropagation();
          });
        });

        dropzone.addEventListener(
          "dragover",
          function (e) {
            this.classList.remove("border-gray-300");
            this.classList.add("border-purple-300");
          },
          false
        );

        dropzone.addEventListener(
          "dragleave",
          function (e) {
            this.classList.remove("border-purple-300");
            this.classList.add("border-gray-300");
          },
          false
        );

        dropzone.addEventListener(
          "drop",
          function (e) {
            this.classList.remove("border-purple-300");
            this.classList.add("border-gray-300");
            files = e.dataTransfer.files;
            dispatchEvent("change",files); 
          },
          false
        );
      }
    }, 100);
  });
</script>

<label
  id="dropzone"
  for="dropzone-file"
  class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5  placeholder-gray-400"
>
  <div class="flex flex-col items-center justify-center pt-5 pb-6">
    <svg
      aria-hidden="true"
      class="w-10 h-10 mb-3 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    <p class="mb-2 text-sm text-gray-500  ">
      <span class="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p class="text-xs text-gray-500  ">
      {subtitle}
    </p>
  </div>
  <input
    id="dropzone-file"
    multiple
    on:change={onClickUpload}
    type="file"
    class="hidden"
  />
</label>

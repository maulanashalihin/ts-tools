<script>
  import { router } from "@inertiajs/svelte";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { t } from "../Language/lang";

  import Layouts from "../Components/layouts.svelte";
  export let Project = {
    description: `
        <p><strong>TEMA HASHTAG</strong></p>

<p>Tema 1</p>

<ul>
	<li>#TemaHashtag1</li>
	<li>#TemaHashtag2</li>
	<li>#TemaHashtag3</li>
</ul>

<p>Tema 2</p>

<ul>
	<li>#TemaHashtag1</li>
	<li>#TemaHashtag2</li>
	<li>#TemaHashtag3</li>
</ul>

<p>&nbsp;</p>

<p><strong>BACKGROUND</strong></p>

<p>ceritakan mengapa project ini dilakukan</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<p><strong>OBJECTIVE</strong></p>

<p>&nbsp;</p>

<p><strong>COMPETITION</strong></p>

<h1>&nbsp;</h1>
`,
  };

  let quill;

  function saveProject() {
    Project.description = quill.root.innerHTML;

    if (Project.id) {
      router.put("/strat-plan/" + Project.id, Project);
    } else {
      router.post("/strat-plan", Project);
    }
  }

  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  onMount(() => {
    quill = new Quill("#description", {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow", // Specify theme in configuration
    });
  });

  let timezone = "WIB";

  const offset = new Date().getTimezoneOffset();

  if (offset == -480) {
    timezone = "WITA";
  }

  if (offset == -540) {
    timezone = "WIT";
  }

  function deleteProject() {
    let check = window.confirm("Apakah yakin mau menghapus Project ini?");
    if (check) {
      router.delete("/strat-plan/" + Project.id);
    }
  }
</script>

<Layouts>
  <!-- Page Heading -->
  <div class="bg-white">
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div
        class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0"
      >
        <div class="grow">
          <h1 class="text-xl font-bold text-gray-700 mb-1">
            {t("Buat Strat Plan Baru")}
          </h1>
        </div>
      </div>
    </div>
  </div>
  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
    <div class="space-y-8">
      <!-- User Profile -->
      <div class="md:flex md:space-x-5">
        <!-- User Profile Info -->
        <div class="md:flex-none md:w-1/3 text-center md:text-left">
          <h3
            class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1"
          >
            <span>{t("Tema Project")} </span>
          </h3>
          <p class="text-gray-500 text-sm mb-5">
            {t("Info utama mengenai Project yang mau diangkat")}
          </p>
        </div>
        <!-- END User Profile Info -->

        <!-- Card: User Profile -->
        <div
          class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3"
        >
          <!-- Card Body: User Profile -->
          <div class="p-5 lg:p-6 grow w-full">
            <form on:submit|preventDefault={saveProject} class="space-y-6">
              <div class="space-y-1">
                <label for="title" class="font-medium"
                  >{t("Judul Project")}</label
                >
                <input
                  bind:value={Project.title}
                  class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="text"
                  id="title"
                  placeholder="Kontra Isu Anti Khilafah"
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="font-medium" for="description"
                  >{t("Deskripsi Project")}</label
                >
                <div id="description">
                  {@html Project.description}
                </div>
              </div>

              <div class="space-y-1">
                <label for="start_time_string" class="font-medium"
                  >Waktu Project Mulai</label
                >
                <input
                  bind:value={Project.start_time_string}
                  class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="date"
                  id="start_time_string"
                  required
                />
                <small class="text-gray-400">waktu dalam {timezone}</small>
              </div>
              <div class="space-y-1">
                <label for="end_time_string" class="font-medium"
                  >Waktu Project Berakhir</label
                >
                <input
                  bind:value={Project.end_time_string}
                  class="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="date"
                  id="end_time_string"
                  required
                />
                <small class="text-gray-400">waktu dalam {timezone}</small>
              </div>

              <button
                type="submit"
                class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
              >
                Simpan Project
              </button>
            </form>
          </div>
          <!-- Card Body: User Profile -->
        </div>
        <!-- Card: User Profile -->
      </div>
      <!-- END User Profile -->

      <!-- Billing Information -->

      <!-- END Billing Information -->

      <!-- Notifications -->

      <!-- Form Action with Button -->
      {#if Project.id}
        <div class="flex flex-row-reverse ">
          <form on:submit|preventDefault={deleteProject} class="md:w-2/3 ">
            <!-- Card -->
            <div
              class="flex flex-col rounded shadow-sm bg-white overflow-hidden"
            >
              <!-- Card Body -->
              <div class="p-5 lg:p-6 grow w-full border-l-4 border-red-300">
                <h3 class="text-lg font-semibold mb-1">Project Deletion</h3>
                <p class="text-gray-500 mb-4">
                  Are you sure you would like to delete this Project? Please be
                  careful since this action cannot be undone!
                </p>
                <button
                  type="submit"
                  class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-red-200 bg-red-200 text-red-700 hover:text-red-700 hover:bg-red-300 hover:border-red-300 focus:ring focus:ring-red-500 focus:ring-opacity-50 active:bg-red-200"
                >
                  Delete Project
                </button>
              </div>
              <!-- END Card Body -->
            </div>
            <!-- END Card -->
          </form>
        </div>
      {/if}
      <!-- END Form Action with Button -->

      <!-- END Notifications -->
    </div>
  </div>
</Layouts>

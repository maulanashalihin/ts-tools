<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";

  import axios from "axios";
  import Modal from "../Components/Modal.svelte";
  import TsLayouts from "./../Components/layouts.svelte";
  import Carousel from "../Components/Carousel.svelte";
  import Typeahead from "svelte-typeahead";

  let publist
  let publisher = "semua";

  export let contents;
  contents.forEach((item) => {
    if (item.type == "slide") {
      item.images_url = JSON.parse(item.images_url);
    }
  });
  contents = contents;

  function UpdateStatus(post, status) {
    post.status = status; 
    axios.put("/omoo-contents/" + post.id+"/status", { status: status, is_omoo : post.is_omoo });
    contents = contents;
  }

function deletePost(channelId, postId) {
  return function () {
    const confirmDelete = confirm("Yakin hapus konten ini?");
    if (confirmDelete) {
      axios.delete("/channel/" + channelId + "/content/" + postId);
      contents = contents.filter((item) => item.id != postId);
    }
  };
}

  function getCustomContents(status, pub) {
    axios.get(`/omoo-contents/${status}/pub/${pub}`).then((response) => {
      contents = response.data;
      contents.forEach((item) => {
        if (item.type == "slide") {
          item.images_url = JSON.parse(item.images_url);
        }
      });
      contents = contents;
    });
  }

  function getPopupContents(pub) {
    axios.get(`/omoo-contents/popup/${pub}`).then((response) => {
      contents = response.data;
      contents.forEach((item) => {
        if (item.type == "slide") {
          item.images_url = JSON.parse(item.images_url);
        }
      });
      contents = contents;
    });
  }

  function setPopUp(item) {
    axios.put("/omoo-contents/" + item.id+"/popup", 
    { 
      item,
      isPopUp,
      popUpCount
     });
    menu = false;
    isPopUp = false;
    popUpCount = null;
  }

  //get publisher list
  axios.get("/omoo-contents/publist").then((response) => {
    publist = response.data;
  });
  

  const statusColor = {
    pending: "bg-gray-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  };

  let menu = false
  let contentMenu
  let isPopUp = false
  let popUpCount

  function isMenu(item) {
    menu = true
    contentMenu = item
  }

  let current = 'semua';

</script>

<div>
  <TsLayouts>
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div class="text-xl font-medium">Konten Omoo</div>

      {#if menu}
        
          <!-- content here -->
          <div class="bg-white rounded p-2 m-2">
            <div class="px-3 py-2 flex gap-3">
              <img
                class="w-10 h-10 rounded-full"
                src={contentMenu.channel_avatar}
                alt=""
              />
              <div class="flex items-center">
                {contentMenu.channel_name}
              </div>
             
            </div>

              <div class="relative flex">

              <div class="w-1/2">
                {#if contentMenu.type == "image"}
                <img src={contentMenu.images_url} alt="" />
                {/if}
                {#if contentMenu.type == "slide"}
                  <Carousel images={contentMenu.images_url} />
                {/if}

                {#if contentMenu.type == "video"}
                  <!-- svelte-ignore a11y-media-has-caption -->
                  <video
                    controls
                    poster={contentMenu.thumbnail ||
                      "https://cdn.dribbble.com/users/17914/screenshots/4902225/media/0d6d47739dae97adc81ca7076ee56cc9.png?compress=1&resize=400x300"}
                  >
                    <source src={contentMenu.video_url} type="video/mp4" />
                    <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                {/if}
              </div>

              <div class="absolute top-4 flex gap-1 left-4 ">
                
                <span
                  class="{statusColor[
                    contentMenu.status
                  ]} text-white px-3 rounded-full"
                >
                  {contentMenu.status}
                </span>
              </div>

              <div class="w-1/2 ml-4">
                <div class="md:text-xl text-lg font-medium">Pop Up Settings</div>

                <div class="mt-2 grid grid-cols-1 gap-2 text-sm md:text-base">
                    <label for="popup" >Tampilkan PopUp ? </label>
                    <div class="flex flex-wrap gap-2">
                      <input type="radio" on:click={() => {isPopUp = true}} class="mt-1" name="option" />
                      <label for="yes">Ya</label>
                      <input type="radio" on:click={() => {isPopUp = false}} class="mt-1" name="option" />
                      <label for="no">Tidak</label>
                    </div>

                    {#if isPopUp}
                    <div class="text-sm md:text-base grid grid-cols-1">
                      <label for="popup-count" > Masukkan target share : </label>
                      <input type="number" bind:value={popUpCount} name="popup-count" class="w-1/2 border border-gray-200 rounded px-3 py-2" />
                      <span class="text-gray-500"> Share saat ini : {contentMenu.share}  </span>
                      <span class="text-gray-500"> PopUp akan otomatis terhapus jika target share telah terpenuhi </span>
                    </div>
                    {/if}

                   <div>
                    <button class="bg-orange-600 text-white px-3 py-2 rounded text-sm md:text-base" on:click={() => setPopUp(contentMenu)}>
                      Simpan
                    </button>
                   </div>

      
                </div>
                

              </div>

              </div>
             
            <div class="p-3">
             
             
              <div class="flex justify-center gap-3 mt-3">
                <div class="inline-flex">
                  
                </div>
              </div>
            </div>
          </div>
       
      {:else}
          <div id="button-group" class="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">

            <button
            class="{current === 'semua' ? 'btngroup-select text-blue-500' : 'btngroup-unselect'}"
            on:click="{() => {
              current = "semua"
                getCustomContents(current, publisher)
            }}"
          >
            Semua
          </button>
          
          
            <button
            class="{current === 'pending' ? 'btngroup-select text-orange-500' : 'btngroup-unselect'}"
            on:click="{() => {
              current = "pending"
                getCustomContents(current, publisher)
            }}"
          >
            Pending
          </button>
          

            <button
            class="{current === 'approved' ? 'btngroup-select text-green-500' : 'btngroup-unselect'}"
            on:click="{() => {
              current = "approved"
                getCustomContents(current, publisher)
            }}"
          >
            Approved
          </button>
        
        
          
            <button
            class="{current === 'rejected' ? 'btngroup-select text-red-500' : 'btngroup-unselect'}"
            on:click="{() => {
              current = "rejected"
                getCustomContents(current, publisher)
            }}"
          >
            Rejected
          </button>

          <button
            class="{current === 'popup' ? 'btngroup-select text-blue-500' : 'btngroup-unselect'}"
            on:click="{() => {
              current = "popup"
                getPopupContents(publisher)
            }}"
          >
            PopUp
          </button>
          
          </div>

        <div class="w-full md:w-1/4">
          <Typeahead
              hideLabel="true"
              limit={5}
              placeholder={`Cari nama publisher`}
              data={publist}
              extract={(item) => item.name}
              on:select={(item) => {
                publisher = item.detail.selected
                getCustomContents(current, publisher)
              }}
              on:clear={() => {
                publisher = "semua";
                getCustomContents(current, publisher)
              }}
            />
        </div>
        

        <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5">
          {#each contents as item}
            <!-- content here -->
            <div class="bg-white rounded  ">
              <div class="px-3 py-2 flex gap-3">
                <img
                  class="w-10 h-10 rounded-full"
                  src={item.channel_avatar}
                  alt=""
                />
                <div class="flex items-center">
                  {item.channel_name}
                </div>
              </div>
              <div class="relative">
                {#if item.type == "image"}
                  <img src={item.images_url} alt="" />
                {/if}
                {#if item.type == "slide"}
                  <Carousel images={item.images_url} />
                {/if}

                {#if item.type == "video"}
                  <!-- svelte-ignore a11y-media-has-caption -->
                  <video
                    controls
                    poster={item.thumbnail ||
                      "https://cdn.dribbble.com/users/17914/screenshots/4902225/media/0d6d47739dae97adc81ca7076ee56cc9.png?compress=1&resize=400x300"}
                  >
                    <source src={item.video_url} type="video/mp4" />
                    <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                {/if}

                <div class="absolute top-4 flex gap-1 left-4 ">
                  
                  <span
                    class="{statusColor[
                      item.status
                    ]} text-white px-3 rounded-full"
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div class="p-3">
                <div class="text-sm text-gray-500 whitespace-pre-line">
                  {item.caption}
                </div>
                <label>
                  <input type="checkbox" bind:checked={item.is_omoo} />
                  <span class="ml-1">Sesuai Strat Plan Omoo</span>
                </label>
                <div class="flex justify-center gap-3 mt-3">
                  <div class="inline-flex">

                    <button on:click={() => { isMenu(item) }} class="font-semibold inline-flex px-2 py-1 mr-2 bg-cyan-200 text-cyan-800">
                      PopUp
                    </button>


                    <button
                      on:click={() => {
                        UpdateStatus(item, "pending");
                      }}
                      type="button"
                      class="{item.status == 'pending'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100'}   -mr-px px-2 py-1 border "
                    >
                      Pending
                    </button>
                    <button
                      on:click={() => {
                        UpdateStatus(item, "approved");
                      }}
                      type="button"
                      class="{item.status == 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'}    px-2 py-1 border"
                    >
                      Approve
                    </button>
                    <button
                      on:click={() => {
                        UpdateStatus(item, "rejected");
                      }}
                      type="button"
                      class="{item.status == 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'hover:bg-gray-100'}  -ml-px  px-2 py-1 border"
                    >
                      Reject
                    </button>

                    <button on:click={deletePost(item.channel_id, item.id)} class="font-semibold inline-flex px-2 py-1 ml-2 bg-red-200 text-red-800">
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      
    </div>
  </TsLayouts>
</div>

<script>
  import Modal from "./Modal.svelte";

    export let strat;

    import dayjs from "dayjs";

    let showModal = false;
</script>
{#if strat}
        
     
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={()=>{showModal = true}}>
            <!-- Alternate Alert -->
<div class="p-4 cursor-pointer md:p-5 flex flex-col lg:flex-row justify-between mb-3 rounded border bg-white">
    <div>
        <p class="text-xs">STRAT PLAN</p>
    <!-- svelte-ignore missing-declaration -->
    <p class="text-xs">{dayjs(strat.start_time_string).format("DD-MM-YYYY")} s.d {dayjs(strat.end_time_string).format("DD-MM-YYYY")}</p>
    <p class="text-gray-600 mt-2">
         {strat.title}
    </p>
    </div>
    <div class="text-xs  flex items-center">
      <div class="underline pt-3">
         <span>Selengkapnya</span>
      </div> 
    </div>
  </div>
  <!-- END Alternate Alert -->
        </div>
        {/if}

        <Modal title="Strat Plan Info" bind:show="{showModal}">
            <div class="p-6 grid gap-6">
                <div>
                    <div class="text-xs">
                        Nama Project
                    </div>
                   <div class="text-lg font-medium">
                    {strat.title}
                   </div>
                </div>
                <div>
                    <div class="text-xs">
                        Deskripsi Project
                    </div>
                   <div class="text-lg font-medium">
                    {@html strat.description}
                   </div>
                </div>
            </div>
        </Modal>
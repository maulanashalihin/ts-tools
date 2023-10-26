<script>
    import { router } from "@inertiajs/svelte";
  import axios from "axios";
    import dayjs from "dayjs"
    import { onMount } from 'svelte';
  
      const { default: Layouts } = require("../Components/layouts.svelte");
      export let campaign
      export let total_tweet;
      export let tweet_submit;
      export let tpm_max;
      export let tpm_stat;
  
  
      let quill;
  
      function saveCampaign()
      {
   
         campaign.report = quill.root.innerHTML;

         if(campaign.id)
        {
          router.put("/campaign/"+campaign.id,campaign)
        }
      }
   
      onMount(()=>{
        quill = new Quill('#report', {
            modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],

                            [{
                                'list': 'ordered'
                            }, {
                                'list': 'bullet'
                            }],
                            [{
                                'script': 'sub'
                            }, {
                                'script': 'super'
                            }],
                            [{
                                'indent': '-1'
                            }, {
                                'indent': '+1'
                            }],
                            [{
                                'direction': 'rtl'
                            }],
                            [{
                                'size': ['small', false, 'large', 'huge']
                            }],
                            [{
                                'header': [1, 2, 3, 4, 5, 6, false]
                            }],
                            [{
                                'color': []
                            }, {
                                'background': []
                            }],
                            [{
                                'font': []
                            }],
                            [{
                                'align': []
                            }],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        handlers: {
                            'image': function () {
                                document.getElementById('getFile').click()
                            },
                            "placeholder": function (value) { 
                                if (value) {
                                    const cursorPosition = quill.getSelection().index;
                                    quill.insertText(cursorPosition, `[${value}]`);
                                    quill.setSelection(cursorPosition + value.length + 2);
                                }
                            }
                        }
                    }
                },
          theme: 'snow'   // Specify theme in configuration
        });
      })
   
      
      function uploadFunction(e)
      {
        var form = new FormData()
                form.append('folder', 'drip-form')
                form.append("image", e.target.files[0]);
                axios.post('https://image.maxgrabb.com/upload', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => { 
                    var range = (quill.getSelection(true))

                    quill.insertEmbed(range.index, 'image', response.data.url);
                })

      }
  
    </script>
    <Layouts>
        <!-- Page Heading -->
        <div class="bg-white">
            <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              <div class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0">
                <div class="grow">
                  <h1 class="text-xl font-bold text-gray-700 mb-1">
                    Laporan Campaign
                  </h1>
                  
                </div>
                
              </div>
            </div>
          </div>
          <!-- END Page Heading -->
      
          <!-- Page Section -->
          <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
              
   

         

            <div class="grid lg:grid-cols-2 gap-5">
              <div class="space-y-8 mb-10">
                <!-- Simple Statistics Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
    <!-- Card: Simple Widget -->
    <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <!-- Card Body: Simple Widget -->
      <div class="p-5 lg:p-6 grow w-full">
        <dl>
          <dt class="text-2xl font-semibold">
            {campaign.attendee}
          </dt>
          <dd class="uppercase font-medium text-sm text-gray-500 tracking-wider">
            Peserta
          </dd>
        </dl>
      </div>
      <!-- END Card Body: Simple Widget -->
    </div>
    <!-- END Card: Simple Widget -->
  
    <!-- Card: Simple Widget -->
    <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <!-- Card Body: Simple Widget -->
      <div class="p-5 lg:p-6 grow w-full">
        <dl>
          <dt class="text-2xl font-semibold">
            {tweet_submit.total}
          </dt>
          <dd class="uppercase font-medium text-sm text-gray-500 tracking-wider">
            Tweet Submit
          </dd>
        </dl>
      </div>
      <!-- END Card Body: Simple Widget -->
    </div>
  
    <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <!-- Card Body: Simple Widget -->
      <div class="p-5 lg:p-6 grow w-full">
        <dl>
          <dt class="text-2xl font-semibold">
            {total_tweet.total}
          </dt>
          <dd class="uppercase font-medium text-sm text-gray-500 tracking-wider">
            Tweet Published
          </dd>
        </dl>
      </div>
      <!-- END Card Body: Simple Widget -->
    </div>
    <!-- END Card: Simple Widget -->
  
    <!-- Card: Simple Widget -->
    <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden">
      <!-- Card Body: Simple Widget -->
      <div class="p-5 lg:p-6 grow w-full">
        <dl>
          <dt class="text-2xl font-semibold">
            {tpm_max}
          </dt>
          <dd class="uppercase font-medium text-sm text-gray-500 tracking-wider">
            Max TPM
          </dd>
        </dl>
      </div>
      <!-- END Card Body: Simple Widget -->
    </div>
    <!-- END Card: Simple Widget -->
  </div>
  <!-- END Simple Statistics Grid -->
  
              </div>
<div>

<h3 class="font-semibold mb-3">
  TPM Statistik
</h3>
 <!-- Responsive Table Container -->
 <div class="border mb-10 border-gray-200 rounded overflow-x-auto min-w-full bg-white">
  <!-- Alternate Responsive Table -->
  <table class="min-w-full text-sm align-middle">
    <!-- Table Header -->
    <thead>
      <tr class="bg-gray-50">
        
        <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
          Waktu
        </th>
        <th class="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
          TPM
        </th> 
      </tr>
    </thead>
    <!-- END Table Header -->

    <!-- Table Body -->
    <tbody>
      {#each Object.keys(tpm_stat) as item}
           <!-- content here -->
           <tr>
              <td class="p-3  ">
                {item}
              </td>
              <td class="p-3">
                <p class="font-medium">
                 {tpm_stat[item]}
                </p> 
              </td>
              
            </tr>
             
      {/each}
    </tbody>
    <!-- END Table Body -->
  </table>
  <!-- END Alternate Responsive Table -->
</div>
<!-- END Responsive Table Container -->
</div>
            </div>

            

              <div class="space-y-8">
                <!-- User Profile -->
                <div class="md:flex md:space-x-5">
                  <!-- User Profile Info -->
                  <div class="md:flex-none md:w-1/3 text-center md:text-left">
                    <h3 class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      
                      <span>Laporan Tertulis</span>
                    </h3>
                    <p class="text-gray-500 text-sm mb-5">
                      Berikan catatan hal-hal penting yang  bisa diambil dari campaign ini
                    </p>
                  </div>
                  <!-- END User Profile Info -->
              
                  <!-- Card: User Profile -->
                  <div class="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
                    <!-- Card Body: User Profile -->
                    <div class="p-5 lg:p-6 grow w-full">
                      <form on:submit|preventDefault={saveCampaign}  enctype="multipart/form-data" class="space-y-6">
                         
                      
                        <div class="space-y-1">
                          <label class="font-medium" for="report">Laporan Tertulis</label>
                          <div id="report">
                              {@html campaign.report || ''}
                          </div>
                          <!-- <textarea  bind:value={campaign.description} class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="description" rows="4" placeholder="motivasi mengapa campaign ini penting"></textarea> -->
                          <input type="file" id="getFile" style="display:none" on:change="{uploadFunction}" />
                        </div>
                        
                        <div class="space-y-1">
                          <label class="font-medium" for="status">Status</label>
                          <select bind:value="{campaign.status}" class="w-full block border border-gray-200 rounded px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" id="status">
                            <option value="tweet submission">Tweet Submission</option>
                            <option value="waiting">Menunggu Campaign</option> 
                            <option value="running">Campaign Berjalan</option> 
                            <option value="done">Campaign Selesai</option> 
                          </select>
                        </div>
                         
                        <button type="submit" class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                          Simpan Campaign
                        </button>
                      </form>
                    </div>
                    <!-- Card Body: User Profile -->
                  </div>
                  <!-- Card: User Profile -->
                </div>
                <!-- END User Profile -->
               
              
                <!-- Notifications -->
                 
                <!-- END Notifications -->
              </div>
       
          </div> 
    </Layouts>
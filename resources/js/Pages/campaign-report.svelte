<script>
    import { Inertia } from "@inertiajs/inertia";
  import axios from "axios";
    import dayjs from "dayjs"
    import { onMount } from 'svelte';
  
      const { default: Layouts } = require("../Components/layouts.svelte");
      export let campaign
  
  
      let quill;
  
      function saveCampaign()
      {
   
         campaign.report = quill.root.innerHTML;

         if(campaign.id)
        {
            Inertia.put("/campaign/"+campaign.id,campaign)
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
              
   
  
              <div class="space-y-8">
                <!-- User Profile -->
                <div class="md:flex md:space-x-5">
                  <!-- User Profile Info -->
                  <div class="md:flex-none md:w-1/3 text-center md:text-left">
                    <h3 class="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
                      <svg class="hi-solid hi-user-circle inline-block w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>
                      <span>Laporan Campaign</span>
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
                          <label class="font-medium" for="report">Laporan Campaign</label>
                          <div id="report">
                              {@html campaign.report}
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
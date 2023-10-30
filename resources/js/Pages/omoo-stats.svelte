<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import Layouts from "../Components/layouts.svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  import Typeahead from "svelte-typeahead";

  let daily_open_rate = [];
  let daily_open_rate_unique = [];
  let open_rate_per_city = [];
  let daily_share_rate = [];
  let daily_share_rate_unique = [];
  let share_rate_per_city = [];

  let events = [];

  let allcity = []

  let city = ''

  let dummy = [{name: "Ram"}, {name: "Shyam"}, {name: "Hari"}, {name: "Krishna"}]

  let model = "table";
  let act = "7day"

  function renderChart() {
    model = "chart";

    setTimeout(() => {
      const ctx = document.getElementById("daily_open_rate");

      let daily_open = new Chart(ctx, {
        type: "bar",
        data: {
          labels: daily_open_rate.map((item) => item.date_only),
          datasets: [
            {
              label: "# Total Aplikasi dibuka",
              data: daily_open_rate.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Jumlah Orang Membuka Aplikasi",
              data: daily_share_rate_unique.map((item) => item.total),
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, 100);
    
    setTimeout(() => {
      const ctx = document.getElementById("daily_share_rate");

      let daily_share = new Chart(ctx, {
        type: "bar",
        data: {
          labels: daily_share_rate.map((item) => item.date_only),
          datasets: [
            {
              label: "# Total Konten dishare",
              data: daily_share_rate.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Jumlah Orang Share Konten",
              data: daily_share_rate_unique.map((item) => item.total),
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, 100);

    setTimeout(() => {
      const ctx = document.getElementById("sebaran_kota");

      let share_rate_cities_object = {};

      share_rate_per_city.forEach((item) => {
        share_rate_cities_object[item.city] = item.total;
      });

      let cities = open_rate_per_city.slice(0, 25);

      let cities_share = cities.map(
        (item) => share_rate_cities_object[item.city] || 0
      );

      let sebaran = new Chart(ctx, {
        type: "bar",
        data: {
          labels: cities.map((item) => item.city),
          datasets: [
            {
              label: "# Tingkat Buka Perkota",
              data: cities.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Tingkat Share Perkota",
              data: cities_share,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, 100);
  }

  function LoadDataCustom(date1, date2, city) {

    axios
      .get("/omoo-stats/datacity", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
          city: city,
        },
      })
      .then((response) => {

        daily_open_rate = response.data.open_rate;
        daily_open_rate.unshift({date_only: 'Total', total: response.data.open_rate.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_open_rate_unique = response.data.open_rate_unique;
        daily_open_rate_unique.unshift({date_only: 'Total', total: response.data.open_rate_unique.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_share_rate = response.data.share_rate;
        daily_share_rate.unshift({date_only: 'Total', total: response.data.share_rate.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_share_rate_unique = response.data.share_rate_unique;
        daily_share_rate_unique.unshift({date_only: 'Total', total: response.data.share_rate_unique.reduce((sum, currentObj) => sum + currentObj.total, 0)})
    
        share_rate_per_city = []
        open_rate_per_city = []

      });
  }

  function LoadData(date1, date2) {
    axios
      .get("/omoo-stats/data", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
        },
      })
      .then((response) => {
        console.log(response.data.daily_open_rate)
        daily_open_rate = response.data.daily_open_rate;
        daily_open_rate.unshift({date_only: 'Total', total: response.data.daily_open_rate.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_open_rate_unique = response.data.daily_open_rate_unique;
        daily_open_rate_unique.unshift({date_only: 'Total', total: response.data.daily_open_rate_unique.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        open_rate_per_city = response.data.open_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
        open_rate_per_city.unshift({city: 'Total', total: response.data.open_rate_per_city.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_share_rate = response.data.daily_share_rate;
        daily_share_rate.unshift({date_only: 'Total', total: response.data.daily_share_rate.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        daily_share_rate_unique = response.data.daily_share_rate_unique;
        daily_share_rate_unique.unshift({date_only: 'Total', total: response.data.daily_share_rate_unique.reduce((sum, currentObj) => sum + currentObj.total, 0)})

        share_rate_per_city = response.data.share_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
        share_rate_per_city.unshift({city: 'Total', total: response.data.share_rate_per_city.reduce((sum, currentObj) => sum + currentObj.total, 0)})
    
      });
  }

  function getCityName() {
    axios.get("/omoo-stats/cityname").then((response) => {
      allcity = response.data.cityresult;
    });
  }



  onMount(() => {
    LoadData(dayjs().subtract(7, "day"), dayjs());
    getCityName();

      const picker = new Litepicker({
      element: document.getElementById("start-date"), // Start date input
      elementEnd: document.getElementById("end-date"), // End date input
      singleMode: false, // Enable date range selection
      startDate: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
      format: "YYYY-MM-DD", // Date format
      autoApply: true, // Apply date selection automatically when the end date is selected
      setup: (picker) => {
        picker.on("selected", (date1, date2) => {
          // some action
          if(city.length > 0) {
              LoadDataCustom(date1, date2, city)
            } else {
              city = ''
              LoadData(date1, date2)
          }
        });
      },
    });

  });
</script>

<Layouts>
  <!-- Page Heading -->
  <div class="bg-white">
    <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
      <div
        class="text-center sm:text-left sm:flex sm:items-center sm:justify-between py-2 lg:py-0 space-y-2 sm:space-y-0"
      >
        <div class="grow">
          <h1 class="text-xl font-bold text-gray-700 mb-1">Omoo Statistik</h1>
        </div>
      </div>
    </div>
  </div>
  <!-- END Page Heading -->

  <!-- Page Section -->
  <div class="container xl:max-w-7xl mx-auto p-4 lg:p-8">
    <!--
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
-->

    <div>

      <div class="mb-4">

        <div class="space-y-2 sm:space-y-0 sm:flex sm:space-x-2 md:w-1/4 rounded-lg">

          <Typeahead
          hideLabel=true
          limit={5}
          placeholder={`Cari nama kota`}
          data={allcity}
          extract={(item) => item.name}
          on:select={(item) => {
            city = item.detail.selected
            LoadDataCustom(dayjs().subtract(7, "day"), dayjs(), item.detail.selected)
          }}
	        on:clear={() => {
            city = ''
            LoadData(dayjs().subtract(7, "day"), dayjs())
          }}
      /> 
     
    

          <!-- <input class="block border border-gray-200 rounded py-2 leading-5 text-sm w-full  p-2" type="text" name="cityname" id="cityname" placeholder="Cari nama kota" />
          <button on:click={() => {
            act = "7day"
            if(document.getElementById("cityname").value.length > 0) {
              LoadDataCustom(dayjs().subtract(7, "day"), dayjs())
            } else {
              document.getElementById("cityname").value = ''
              LoadData(dayjs().subtract(7, "day"), dayjs())
            }
          }} class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded-lg border-emerald-200 bg-emerald-200 text-emerald-700 hover:text-emerald-700 hover:bg-emerald-300 hover:border-emerald-300 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 active:bg-emerald-200">
            Cari
          </button> -->
        </div> <br>
        
        <button
            on:click={() => {
              act = "7day"
              model = "table"
              document.getElementById('customdate').classList.add("hidden");
              if(city.length > 0) {
                LoadDataCustom(dayjs().subtract(7, "day"), dayjs())
              } else {
                LoadData(dayjs().subtract(7, "day"), dayjs())
              }
            }}
            class="{act == "7day"
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            7 Hari
          </button>
          <button
            on:click={() => {
              act = "30day"
              model = "table"
              document.getElementById('customdate').classList.add("hidden");
              if(city.length > 0) {
                LoadDataCustom(dayjs().subtract(30, "day"), dayjs())
              } else {
                LoadData(dayjs().subtract(30, "day"), dayjs())
              }
            }}
            class="{act == "30day"
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            30 Hari
          </button>
          <button
            on:click={() => {
              model = "table";
              act = "custom"
              document.getElementById('customdate').classList.remove("hidden");
            }}
            class="{act == "custom"
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            Custom
          </button>
          <br>

          <div class="hidden" id="customdate">
            <br>
            <div class="flex gap-3"> 
              
              <div class="relative">
                <div class="absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l-lg text-sky-600 bg-sky-100 border-r ">
                  <svg class="hi-outline hi-calendar inline-block w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <input class="block border border-gray-200 rounded-lg pl-12 py-2 leading-5 text-sm w-full" type="text" id="start-date" placeholder="0,00" />
              </div>

              <div class="relative">
                <div class="absolute inset-y-0 left-0 w-10 my-px ml-px flex items-center justify-center pointer-events-none rounded-l-lg text-sky-600 bg-sky-100 border-r">
                  <svg class="hi-outline hi-calendar inline-block w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <input class="block border border-gray-200 rounded-lg pl-12 py-2 leading-5 text-sm w-full " type="text" id="end-date" placeholder="0,00" />
              </div>

            </div>
          </div>
        
      </div>
      <div class="mb-5">
        <nav class="flex gap-6" aria-label="Tabs">
          <button
            on:click={() => {
              model = "table";
            }}
            class="{model == 'table'
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            Table
          </button>

          <button
            on:click={renderChart}
            class="{model == 'chart'
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            Chart
          </button>
        </nav>
      </div>
    </div>
    {#if model == "table"}
      <div class="grid gap-3 lg:grid-cols-3">
        <div>
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Tingkat Buka Harian</div>
            {#each daily_open_rate as item}
              <div class="flex justify-between">
                <div>
                  {item.date_only}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Tingkat Share Harian</div>
            {#each daily_share_rate as item}
              <div class="flex justify-between">
                <div>
                  {item.date_only}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">
              Jumlah Orang Membuka Per Hari
            </div>
            {#each daily_open_rate_unique as item}
              <div class="flex justify-between">
                <div>
                  {item.date_only}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">
              Jumlah Orang Share Per Hari
            </div>
            {#each daily_share_rate_unique as item}
              <div class="flex justify-between">
                <div>
                  {item.date_only}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div>
          {#if open_rate_per_city.length > 0}
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Tingkat Buka Perkota</div>
            {#each open_rate_per_city as item}
              <div class="flex justify-between">
                <div>
                  {item.city}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
          {/if}
        </div>
        <div>

          {#if share_rate_per_city.length > 0} 
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Tingkat Share Perkota</div>
            {#each share_rate_per_city as item}
              <div class="flex justify-between">
                <div>
                  {item.city}
                </div>
                <div>
                  {item.total.toLocaleString("id")}
                </div>
              </div>
            {/each}
          </div>
          {/if}

        </div>

        <!--
        
        ADD YOUR MAIN CONTENT ABOVE
              
        -->
      </div>
    {:else if model == "chart"}
      <div class="space-y-6">
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Tingkat Buka Harian</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_open_rate" />
            </div>
          </div>
        </div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Tingkat Share Harian</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_share_rate" />
            </div>
          </div>
        </div>

        {#if open_rate_per_city.length > 0}
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Sebaran Kota/Kabupaten</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="sebaran_kota" />
            </div>
          </div>
        </div>
        {/if}

      </div>
    {/if}
  </div></Layouts
>

<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import Layouts from "../Components/layouts.svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  import Typeahead from "svelte-typeahead";
  import Carousel from "../Components/Carousel.svelte";
  import cities from "../Components/cities.json";

  let daily_open_rate = [];
  let daily_open_rate_unique = [];
  let open_rate_per_city = [];
  let daily_share_rate = [];
  let daily_share_rate_unique = [];
  let share_rate_per_city = [];

  let trending = []

  let events = [];

  let allcity = [];

  let province = Object.values(cities)
    .flatMap(cityList => cityList.map(city => city.province))
    .filter((province, index, self) => self.indexOf(province) === index)
    .map(province => ({name: province}));

  console.log(province)

  let city = "";
  let stratplan = false

  let model = "table";
  let act = "7day";

  let countday = 7
  let gender = "all"

  let showAllShare = false;
  let showAllOpen = false;

  function getDataCity(province) {
    const filteredCities = Object.values(cities).reduce((acc, provCities) => {
      const citiesInProvince = provCities.filter(city => city.province === province);
      return acc.concat(citiesInProvince.map(city => ({
        city: `${city.type} ${city.city_name}`,
      })));
    }, []);

    if (filteredCities.length === 0) {
      console.log('not found any data city');
    }

    return filteredCities;
  }

  const result = getDataCity('Bali');
  console.log(result);

  function toggleShowAll(type) { type === 'share' ? showAllShare = !showAllShare : showAllOpen = !showAllOpen; }

  function renderChart() {
    model = "chart";

    setTimeout(() => {
      const ctx = document.getElementById("daily_open_rate");

      let dailyopen = daily_open_rate.slice(1)
      let dailyopenunique = daily_open_rate_unique.slice(1)

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: dailyopen.map((item) => item.date_only),
          datasets: [
            {
              label: "# Total Aplikasi dibuka",
              data: dailyopen.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Jumlah Orang Membuka Aplikasi",
              data: dailyopenunique.map((item) => item.total),
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

      let dailyshare = daily_share_rate.slice(1)
      let dailyshareunique = daily_share_rate_unique.slice(1)

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: dailyshare.map((item) => item.date_only),
          datasets: [
            {
              label: "# Total Konten dishare",
              data: dailyshare.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Jumlah Orang Share Konten",
              data: dailyshareunique.map((item) => item.total),
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

      let shareratecities = share_rate_per_city.slice(1);

      shareratecities.forEach((item) => {
        share_rate_cities_object[item.city] = item.total;
      });

      let openratecity = open_rate_per_city.slice(1);

      let cities = openratecity.slice(0, 25);

      let cities_share = cities.map(
        (item) => share_rate_cities_object[item.city] || 0
      );

      let sebaran = new Chart(ctx, {
        type: "bar",
        data: {
          labels: cities.map((item) => item.city),
          datasets: [
            {
              label: "# Frekuensi Buka Tiap Kota",
              data: cities.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Frekuensi Share Tiap Kota",
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
    countday = Math.abs(dayjs(date1).diff(dayjs(date2), 'day'))

    const foundProvince = province.find(p => p.name === city);
    if (foundProvince) {
      city =  getDataCity(foundProvince.name)
      city = city.map(c => c.city).join(',');
    }

    axios
      .get("/omoo-stats/datacity", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
          city: city,
          gender: gender
        },
      })
      .then((response) => {
        daily_open_rate = response.data.open_rate;
        daily_open_rate.unshift({
          date_only: "Total",
          total: response.data.open_rate.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_open_rate_unique = response.data.open_rate_unique;
        daily_open_rate_unique.unshift({
          date_only: "Total",
          total: response.data.open_rate_unique.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_share_rate = response.data.share_rate;
        daily_share_rate.unshift({
          date_only: "Total",
          total: response.data.share_rate.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_share_rate_unique = response.data.share_rate_unique;
        daily_share_rate_unique.unshift({
          date_only: "Total",
          total: response.data.share_rate_unique.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        share_rate_per_city = [];
        open_rate_per_city = [];
      });
  }

  function LoadData(date1, date2) {
    countday = Math.abs(dayjs(date1).diff(dayjs(date2), 'day'))
    axios
      .get("/omoo-stats/data", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
          gender: gender
        },
      })
      .then((response) => {
        console.log(response.data.daily_open_rate);
        daily_open_rate = response.data.daily_open_rate;
        daily_open_rate.unshift({
          date_only: "Total",
          total: response.data.daily_open_rate.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_open_rate_unique = response.data.daily_open_rate_unique;
        daily_open_rate_unique.unshift({
          date_only: "Total",
          total: response.data.daily_open_rate_unique.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        open_rate_per_city = response.data.open_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
        open_rate_per_city.unshift({
          city: "Total",
          total: response.data.open_rate_per_city.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_share_rate = response.data.daily_share_rate;
        daily_share_rate.unshift({
          date_only: "Total",
          total: response.data.daily_share_rate.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        daily_share_rate_unique = response.data.daily_share_rate_unique;
        daily_share_rate_unique.unshift({
          date_only: "Total",
          total: response.data.daily_share_rate_unique.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });

        share_rate_per_city = response.data.share_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
        share_rate_per_city.unshift({
          city: "Total",
          total: response.data.share_rate_per_city.reduce(
            (sum, currentObj) => sum + currentObj.total,
            0
          ),
        });
      });
  }

  function loadDataTrending(date1, date2) {
    axios.get("/omoo-stats/trending", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
          omoo: stratplan
        },
      }).then((response) => {
      trending = response.data.konten;
      trending.forEach((item) => {
        if (item.type == "slide") {
          item.images_url = JSON.parse(item.images_url);
        }
      });
    });
  }

  function getCityName() {
    axios.get("/omoo-stats/cityname").then((response) => {
      allcity = response.data.city;
      allcity.push(...province);
    });

    

  }

  onMount(async () => {
    LoadData(dayjs().subtract(7, "day"), dayjs());
    getCityName();

    let start_date = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    let end_date = dayjs().format("YYYY-MM-DD");

    countday = Math.abs(dayjs(start_date).diff(dayjs(end_date), 'day'))
    console.log(countday)

    const picker = new easepick.create({
      element: document.getElementById("datepicker"),
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css",
        "https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css",
      ],
      plugins: ["RangePlugin"],
      RangePlugin: {
        tooltip: true,
      },
      setup(picker) {
        picker.on("select", (e) => {
          const { end, start } = e.detail;

          start_date = dayjs(start);
          end_date = dayjs(end);

          // some action
          if (model == "konten") {
              loadDataTrending(start_date, end_date);
            } else if (city.length > 0) {
              model = "table";
              LoadDataCustom(start_date, end_date, city);
            } else {
              model = "table";
              city = "";
              LoadData(start_date, end_date);
            }

          // do something
        });
      },
    });

    picker.setDateRange(start_date, end_date);

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
        <div
          class="space-y-2 sm:space-y-0 sm:flex sm:space-x-2 md:w-1/4 rounded-lg"
        >
          <Typeahead
            hideLabel="true"
            limit={5}
            placeholder={`Cari nama kota/provinsi`}
            data={allcity}
            extract={(item) => item.name}
            on:select={(item) => {
              city = item.detail.selected;
              model = "table";
              LoadDataCustom(
                dayjs().subtract(7, "day"),
                dayjs(),
                item.detail.selected
              );
            }}
            on:clear={() => {
              act = "7day";
              city = "";
              LoadData(dayjs().subtract(7, "day"), dayjs());
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
        </div>

        <div class="mt-3 mb-3">
          <button
            on:click={() => {
              act = "7day";
              gender = "all"
            
              if (model == "konten") {
                loadDataTrending(dayjs().subtract(7, "day"), dayjs());
              } else if (city.length > 0) {
                model = "table";
                LoadDataCustom(dayjs().subtract(7, "day"), dayjs());
              } else {
                model = "table";
                LoadData(dayjs().subtract(7, "day"), dayjs());
              }
              
            }}
              class="{gender == 'all'
                ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
                : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
              >
              Semua
          </button>

          <button
            on:click={() => {
              act = "7day";
              gender = "Laki-Laki"
            
              if (model == "konten") {
                loadDataTrending(dayjs().subtract(7, "day"), dayjs());
              } else if (city.length > 0) {
                model = "table";
                LoadDataCustom(dayjs().subtract(7, "day"), dayjs());
              } else {
                model = "table";
                LoadData(dayjs().subtract(7, "day"), dayjs());
              }
              
            }}
              class="{gender == 'Laki-Laki'
                ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
                : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
              >
              Laki-laki
          </button>

          <button
            on:click={() => {
              act = "7day";
              gender = "Perempuan"
            
              if (model == "konten") {
                loadDataTrending(dayjs().subtract(7, "day"), dayjs());
              } else if (city.length > 0) {
                model = "table";
                LoadDataCustom(dayjs().subtract(7, "day"), dayjs());
              } else {
                model = "table";
                LoadData(dayjs().subtract(7, "day"), dayjs());
              }
              
            }}
              class="{gender == 'Perempuan'
                ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
                : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
              >
              Perempuan
          </button>

          <button
            on:click={() => {
              act = "7day";
              gender = null
            
              if (model == "konten") {
                loadDataTrending(dayjs().subtract(7, "day"), dayjs());
              } else if (city.length > 0) {
                model = "table";
                LoadDataCustom(dayjs().subtract(7, "day"), dayjs());
              } else {
                model = "table";
                LoadData(dayjs().subtract(7, "day"), dayjs());
              }
              
            }}
              class="{gender == null
                ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
                : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
              >
              Null
          </button>
        </div>

        <button
          on:click={() => {
            act = "7day";
            
            if (model == "konten") {
              loadDataTrending(dayjs().subtract(7, "day"), dayjs());
            } else if (city.length > 0) {
              model = "table";
              LoadDataCustom(dayjs().subtract(7, "day"), dayjs());
            } else {
              model = "table";
              LoadData(dayjs().subtract(7, "day"), dayjs());
            }
            
          }}
          class="{act == '7day'
            ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
            : 'shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
        >
          7 Hari
        </button>
        <button
          on:click={() => {
            act = "30day";
            
            if (model == "konten") {
              loadDataTrending(dayjs().subtract(30, "day"), dayjs());
            } else if (city.length > 0) {
              model = "table";
              LoadDataCustom(dayjs().subtract(30, "day"), dayjs());
            } else {
              model = "table";
              LoadData(dayjs().subtract(30, "day"), dayjs());
            }
          }}
          class="{act == '30day'
            ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
            : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
        >
          30 Hari
        </button>
        <button
          on:click={() => {
            act = "custom";
            
          }}
          class="{act == 'custom'
            ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
            : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
        >
          Custom
        </button>
        <br />

        <div  >
           
          <div class="mt-3">
            
            <div class="flex items-center">
              <button type="button" class="inline-flex justify-center items-center space-x-2 border font-medium focus:outline-none flex-none z-1 px-3 py-2 leading-5 text-sm rounded-l-lg active:z-1 focus:z-1 -mr-px bg-sky-100 text-sky-600">
                Rentang Waktu
              </button>
              <input class="block border border-gray-200 p-2 rounded-r-lg py-2 leading-5 text-sm w-full active:z-1 focus:z-1 md:w-1/6" type="text" id="datepicker" />
            </div> 
          </div>
        </div>
      </div>
      <div class="mb-5">
        <nav class="flex gap-2" aria-label="Tabs">
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

          <button
            on:click={() => {
              model = "konten";
              loadDataTrending(dayjs().subtract(7, "day"), dayjs());
            }}
            class="{model == 'konten'
              ? 'shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600'
              : ' shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700'}  "
          >
            Konten
          </button>

        </nav>
      </div>
    </div>
    {#if model == "table"}
      <div class="grid gap-3 lg:grid-cols-3">
        <div>
          <div class="bg-white p-6 h-full rounded-lg">
            <div class="mb-3 text-lg font-medium">Frekuensi Buka Harian</div>

              <table class="w-full">
                {#each daily_open_rate as item}
                  <tr>
                    <td>{item.date_only}</td>
                    <td class="text-right">{item.total.toLocaleString("id")}</td>
                  </tr>
                {/each}
              </table>

          </div>
        </div>

        <div>
          <div class="bg-white p-6 h-full rounded-lg">
            <div class="mb-3 text-lg font-medium">Frekuensi Share Harian</div>

            <table class="w-full">
              {#each daily_share_rate as item}
                <tr>
                  <td>{item.date_only}</td>
                  <td class="text-right">{item.total.toLocaleString("id")}</td>
                </tr>
              {/each}
            </table>

          </div>
        </div>

        <div>
          <div class="bg-white p-6 h-full rounded-lg">
            <div class="mb-3 text-lg font-medium">
              Jumlah Orang Membuka OMOO (Harian)
            </div>

            <table class="w-full">
              {#each daily_open_rate_unique as item}
                <tr>
                  <td>{item.date_only}</td>
                  <td class="text-right">{item.total.toLocaleString("id")}</td>
                </tr>
              {/each}
            </table>

          </div>
        </div>

        <div>
          <div class="bg-white p-6 h-full rounded-lg">
            <div class="mb-3 text-lg font-medium">
              Jumlah Orang Share Konten (Harian)
            </div>

            <table class="w-full">
              {#each daily_share_rate_unique as item}
                <tr>
                  <td>{item.date_only}</td>
                  <td class="text-right">{item.total.toLocaleString("id")}</td>
                </tr>
              {/each}
            </table>

          </div>
        </div>

        <div>
          <div class="bg-white p-6 h-full rounded-lg">
            <div class="mb-3 text-lg font-medium">
              Frekuensi Search Tiap Publisher 
            </div>

            <table class="w-full">
             
            </table>

          </div>
        </div>

        <div>
          {#if open_rate_per_city.length > 0}
            <div class="bg-white p-6 h-full rounded-lg">
              <div class="mb-3 text-lg font-medium">Frekuensi Buka Tiap Kota</div>

              <table class="w-full">
                {#each open_rate_per_city as item, index}

                  {#if index <= countday || showAllOpen}
                    <tr>
                      <td>{index == 0 ? '' : `${index}.`} {item.city}</td>
                      <td class="text-right">{item.total.toLocaleString("id")}</td>
                    </tr>
                  {:else}
                    <tr style="display: none">
                      <td>{index == 0 ? '' : `${index}.`} {item.city}</td>
                      <td class="text-right">{item.total.toLocaleString("id")}</td>
                    </tr>
                  {/if}
                  
                {/each}
              </table>
             <button on:click={() => toggleShowAll('open')} class="text-blue-500 mt-0.5">{showAllOpen ? 'Lihat Lebih Sedikit' : 'Lihat Semua Kota'}</button>

            </div>
          {/if}
        </div>

        <div>
          {#if share_rate_per_city.length > 0}
            <div class="bg-white p-6 h-full rounded-lg">
              <div class="mb-3 text-lg font-medium">Frekuensi Share Tiap Kota</div>

              <table class="w-full">
                {#each share_rate_per_city as item, index}

                {#if index <= countday || showAllShare}
                  <tr>
                    <td>{index == 0 ? '' : `${index}.`} {item.city}</td>
                    <td class="text-right">{item.total.toLocaleString("id")}</td>
                  </tr>
                {:else}
                  <tr style="display: none">
                    <td>{index == 0 ? '' : `${index}.`} {item.city}</td>
                    <td class="text-right">{item.total.toLocaleString("id")}</td>
                  </tr>
                {/if}
                  
                {/each}
              </table>
              <button on:click={() => toggleShowAll('share')} class="text-blue-500 mt-0.5">{showAllShare ? 'Lihat Lebih Sedikit' : 'Lihat Semua Kota'}</button>

            </div>
          {/if}
        </div>

      </div>
    {:else if model == "chart"}
      <div class="space-y-6">
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Frekuensi Buka Harian</div>
          <div>Total Aplikasi Dibuka : {daily_open_rate[0].total}</div>
          <div>Jumlah Orang Membuka Aplikasi : {daily_open_rate_unique[0].total}</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_open_rate" />
            </div>
          </div>
        </div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Frekuensi Share Harian</div>
          <div >Total Konten Dishare : {daily_share_rate[0].total}</div>
          <div >Jumlah Orang Share Konten : {daily_share_rate_unique[0].total}</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_share_rate" />
            </div>
          </div>
        </div>

        {#if open_rate_per_city.length > 0}
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Sebaran Kota/Kabupaten</div>
            <div >Frekuensi Buka Tiap Kota : {open_rate_per_city[0].total}</div>
            <div >Frekuensi Share Tiap Kota : {share_rate_per_city[0].total}</div>
            <div class="flex justify-center">
              <div class="w-full">
                <canvas id="sebaran_kota" />
              </div>
            </div>
          </div>
        {/if}
      </div>

    {:else if model == "konten"}
    
    
    <div class="inline-flex items-center space-x-3">
      <input type="checkbox" id="tk-form-switches-with-labels-small"  class="form-switch transition-all duration-150 ease-out rounded-full h-6 w-10 text-sky-600" on:click={() => {
        stratplan = !stratplan
        //select sesuai act
        if(act == "7day") loadDataTrending(dayjs().subtract(7, "day"), dayjs())
        else if(act == "30day") loadDataTrending(dayjs().subtract(30, "day"), dayjs())
        else if(act == "custom") {
          let start_date = dayjs(document.getElementById("datepicker").value.split(" - ")[0])
          let end_date = dayjs(document.getElementById("datepicker").value.split(" - ")[1])
          loadDataTrending(start_date, end_date)
        }
      }} />
      <label for="tk-form-switches-with-labels-small" class="text-sm text-gray-500 font-medium">
        Filter Konten Sesuai Strat Plan OMOO
      </label>
    </div>


    <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5 z-0">
      {#each trending as item, index}
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
              <br> Rank : {index + 1} | Point : {item.point}
              <br> Like : {item.likes} | Share : {item.share}
            </div>
          </div>
          <div class=" ">
            {#if item.type == "image"}
              <img src={item.images_url} class="z-0" alt="" />
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

            
          </div>
        </div>
      {/each}
    </div>
     
    {/if}

  </div></Layouts
>

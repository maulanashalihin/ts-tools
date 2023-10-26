<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import Layouts from "../Components/layouts.svelte";
  import { onMount } from "svelte";
  import axios from "axios";

  let daily_open_rate = [];
  let daily_open_rate_unique = [];
  let open_rate_per_city = [];
  let daily_share_rate = [];
  let daily_share_rate_unique = [];
  let share_rate_per_city = [];

  let model = "table";

  function renderChart() {
    model = "chart";

    setTimeout(() => {
      const ctx = document.getElementById("daily_open_rate");

      new Chart(ctx, {
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
              label: "# Total Aplikasi dibuka (unique people)",
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

      new Chart(ctx, {
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
              label: "# Total Konten dishare (unique people)",
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

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: cities.map((item) => item.city),
          datasets: [
            {
              label: "# Open Rate by Cities",
              data: cities.map((item) => item.total),
              borderWidth: 1,
            },
            {
              label: "# Share Rate by Cities",
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

  function LoadData(date1, date2) {
    axios
      .get("/omoo-stats/data", {
        params: {
          from: date1.format("YYYY-MM-DD"),
          to: date2.format("YYYY-MM-DD"),
        },
      })
      .then((response) => {
        daily_open_rate = response.data.daily_open_rate;
        daily_open_rate_unique = response.data.daily_open_rate_unique;
        open_rate_per_city = response.data.open_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
        daily_share_rate = response.data.daily_share_rate;
        daily_share_rate_unique = response.data.daily_share_rate_unique;
        share_rate_per_city = response.data.share_rate_per_city
          .filter((item) => item.city != null)
          .sort((a, b) => {
            return b.total - a.total;
          });
      });
  }
  onMount(() => {
    LoadData(dayjs().subtract(7, "day"), dayjs());

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
          LoadData(date1, date2);
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
        <input type="text" id="start-date" placeholder="Start Date" />
        <input type="text" id="end-date" placeholder="End Date" />
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
            <div class="mb-3 text-lg font-medium">Daily Open Rate</div>
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
            <div class="mb-3 text-lg font-medium">Daily Share Rate</div>
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
              Daily Unique People Open Rate
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
              Daily Unique People Share Rate
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
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Open Rate by Cities</div>
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
        </div>
        <div>
          <div class="bg-white p-6">
            <div class="mb-3 text-lg font-medium">Share Rate by Cities</div>
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
        </div>

        <!--
        
        ADD YOUR MAIN CONTENT ABOVE
              
        -->
      </div>
    {:else if model == "chart"}
      <div class="space-y-6">
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Daily Open Rate</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_open_rate" />
            </div>
          </div>
        </div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Daily Share Rate</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="daily_share_rate" />
            </div>
          </div>
        </div>
        <div class="bg-white p-6">
          <div class="mb-3 text-lg font-medium">Sebaran Kota/Kabupaten</div>
          <div class="flex justify-center">
            <div class="w-full">
              <canvas id="sebaran_kota" />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div></Layouts
>

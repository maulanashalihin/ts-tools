<script>
  import dayjs from "dayjs";
  import { inertia, Link } from "@inertiajs/svelte";
  import { t } from "../Language/lang";
  import Layouts from "../Components/layouts.svelte";

  export let daily_open_rate;
  export let daily_open_rate_unique;
  export let open_rate_per_city;
  export let daily_share_rate;
  export let daily_share_rate_unique;
  export let share_rate_per_city;

  open_rate_per_city = open_rate_per_city.sort((a, b) => {
    return b.total - a.total;
  });

  share_rate_per_city = share_rate_per_city.sort((a, b) => {
    return b.total - a.total;
  });

  open_rate_per_city = open_rate_per_city.shift();
  share_rate_per_city = share_rate_per_city.shift();

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

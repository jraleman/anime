<script lang="ts">
  import { Doughnut } from 'svelte-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
  import { chartBgColors, chartHoverBgColors } from '$lib/utils/colors';

  export let animeList;

  let genres: { [key: string]: number } = {};

  if ($animeList) {
    $animeList.forEach((anime: any) => {
      anime.node.genres.map(({ name }: { name: string }) => {
        genres = { ...genres, [name]: genres[name] ? genres[name] + 1 : 1 };
      });
    });
  }

  let data = {
    labels: Object.keys(genres),
    datasets: [
      {
        data: Object.values(genres),
        backgroundColor: chartBgColors,
        hoverBackgroundColor: chartHoverBgColors
      }
    ]
  };

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

<div class="collapse bg-base-200 mx-auto max-w-screen-xl mt-5 mb-5">
  <input type="checkbox" />
  <div class="collapse-title text-xl font-medium">Click to see the genre breakdown of the anime list</div>
  <div class="collapse-content">
    <div class="alert block text-center" style="text-align: -webkit-center;">
      <Doughnut {data} options={{ responsive: true }} />
    </div>
  </div>
</div>

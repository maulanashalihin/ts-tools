<script>
	import { onMount } from 'svelte';
     import Carousel from 'svelte-carousel'
     export let images;

     onMount(()=>{ 
         setTimeout(()=>{
            document.querySelectorAll('.sc-carousel-button').forEach(item=>{
              
              item.setAttribute("type","button")
          },1000)
         })
     })
</script>
 
  <Carousel
  let:loaded
  arrows={false}
  swiping={true}
>
  {#each images as src, imageIndex (src)}
    <div class="img-container">
      {#if loaded.includes(imageIndex)}
        <img {src} alt="nature" />
      {/if}
    </div>
  {/each}
</Carousel>
import '../css/app.css'

import { createInertiaApp } from '@inertiajs/svelte'
 




createInertiaApp({
  progress: {
    color: 'orange',
  },
  resolve: name => require(`./Pages/${name}.svelte`),
  setup({ el, App, props }) { 

    new App({ target: el, props })
  },
})
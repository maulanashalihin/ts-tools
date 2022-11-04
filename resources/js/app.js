import '../css/app.css'

import { createInertiaApp } from '@inertiajs/inertia-svelte'

import { InertiaProgress } from '@inertiajs/progress'




createInertiaApp({
  resolve: name => require(`./Pages/${name}.svelte`),
  setup({ el, App, props }) {
    
    InertiaProgress.init()

    new App({ target: el, props })
  },
})
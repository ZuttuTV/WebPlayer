import { mount } from 'svelte'
import Player from './App.svelte'

const app = mount(Player, {
  target: document.getElementById('app')!,
})

export default app

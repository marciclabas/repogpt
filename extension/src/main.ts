import { mount } from 'svelte'
import './index.css'
import App from './popup/App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app

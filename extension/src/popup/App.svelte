<script lang="ts">
  import { activeTab, navigate } from "$lib/browser";
  import type { Branch } from "repogpt";
  import Landing from "./Landing.svelte";
  import Url from "./Url.svelte";
  import Config from "./Config.svelte";
  import Run from "./Run.svelte";

  type Page = 'loading' | 'landing' | 'url' | 'config' | 'run'

  let page: Page = $state('landing');
  let chunks = $state(8)
  let branch: Branch = $state({ owner: '', repo: '', branch: 'main' });

  (async () => {
    const tab = await activeTab()
    page = tab.url?.includes('/gpts/editor')
      ? 'url'
      : 'landing'
  })();

  async function onGo() {
    await navigate('https://chatgpt.com/gpts/editor')
    page = 'url'
  }
  
  function start(newChunks: number, newBranch?: Branch) {
    if (!newBranch)
      page = 'config'
    else {
      chunks = newChunks
      branch = newBranch
      page = 'run'
    }
  }

  function back() {
    page = 'config'
  }

</script>

{#if page === 'loading'}
  <div>Loading...</div>
{:else if page === 'landing'}
  <Landing {onGo} />
{:else if page === 'url'}
  <Url {start} />
{:else if page === 'config'}
  <Config {start} {...branch} {chunks} />
{:else if page === 'run'}
  <Run {...branch} {chunks} {back} />
{/if}


<style>
</style>
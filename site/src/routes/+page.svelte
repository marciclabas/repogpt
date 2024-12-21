<script lang='ts'>
  import Landing from './Landing.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import type { Branch } from 'repogpt/repo';
    import ExtensionBanner from './ExtensionBanner.svelte';
    import Footer from './Footer.svelte';

  function start(chunks: number, branch?: Branch) {
    const hash = branch
      ? `#chunks=${chunks}&owner=${branch.owner}&repo=${branch.repo}&branch=${branch.branch ?? "main"}`
      : ''
    goto(`${base}/concat${hash}`);
  }
</script>

<Landing {start} />
<script lang='ts'>
  import Landing from './Landing.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import type { Branch } from 'repogpt/repo';

  function parseUrl(repoUrl: string): Branch {
    const [owner, repo] = repoUrl.split('github.com/')[1].split('/');
    return { owner, repo }
  }

  function start(repoUrl: string, chunks: number) {
    try {
      const { owner, repo, branch = 'main' } = parseUrl(repoUrl);
      goto(`${base}/concat#chunks=${chunks}&owner=${owner}&repo=${repo}&branch=${branch}`);
    }
    catch {}
  }
</script>

<Landing {start} />
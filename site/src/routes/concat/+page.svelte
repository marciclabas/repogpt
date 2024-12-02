<script lang="ts">
  import { page } from '$app/stores'
  import Concat from './Concat.svelte';
  const params = new URLSearchParams($page.url.hash.slice(1))
  const repo = params.get('repo') ?? ''
  const owner = params.get('owner') ?? ''
  const branch = params.get('branch') ?? ''
  const rawChunks = parseInt(params.get('chunks') ?? '')
  const chunks = isNaN(rawChunks) ? 1 : rawChunks

</script>

<Concat {repo} {owner} {branch} {chunks} />


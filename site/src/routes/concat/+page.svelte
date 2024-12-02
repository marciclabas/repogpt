<script lang="ts">
    import { goto } from '$app/navigation';
  import { page } from '$app/stores'
    import Concat, { type Settings } from './Concat.svelte';
  const params = $page.url.searchParams
  const repo = params.get('repo') ?? ''
  const owner = params.get('owner') ?? ''
  const branch = params.get('branch') ?? ''
  const chunks = parseInt(params.get('chunks') ?? '')

  if (!repo || !owner || !branch || isNaN(chunks))
    goto('..');

</script>

<Concat {repo} {owner} {branch} {chunks} />


<script lang="ts" module>
    import { runScript } from "$lib/browser";
    import { download } from "$lib/download";
    import { enterGptFields, gptFields, uploadGptFiles } from "$lib/gpt";
  import { summarizeZip, type Branch } from "repogpt";

  export type Props = Branch & {
    chunks: number
    back(): void
  }

  function repoName(branch: Branch) {
    return `${branch.owner}/${branch.repo}/${branch.branch}`
  }

</script>


<script lang="ts">
  const { chunks, back, ...branch }: Props = $props()

  let logs: string[] = $state([])

  async function runDownload({ owner, repo, branch }: Required<Branch>): Promise<ArrayBuffer|null> {
    
    const name = repoName({ owner, repo, branch });
    const msg = `Downloading ${name}...`

    logs.push(msg);

    for await (const progress of download({ owner, repo, branch })) {
      if (progress.tag === "download-progress") {
        if (progress.total) {
          const percent = ((100 * progress.loaded) / progress.total).toFixed(2);
          const totalKb = (progress.total / 1024).toFixed(2);
          logs[logs.length - 1] = `${msg} [${percent}% of ${totalKb}KB]`;
        } else {
          const loadedKb = (progress.loaded / 1024).toFixed(2);
          logs[logs.length - 1] = `${msg} [${loadedKb}KB]`;
        }
      }
      else if (progress.tag === "download-done") {
        const totalKb = (progress.total / 1024).toFixed(2);
        logs[logs.length - 1] = `Downloaded ${name} [${totalKb}KB]`;
        return progress.result;
      }
      else if (progress.tag === "download-error") {
        logs.push(`Error downloading ${name}: ${progress.detail}`);
      }
    }
    return null
  }

  async function runConcat(zip: ArrayBuffer, branch: Branch, batches: number) {
    logs.push("Processing files... 0");

    let i = 0
    for await (const content of summarizeZip(zip, { batches, ...branch })) {
      runScript(uploadGptFiles, [[{ name: `${i}.txt`, content }]])
      i++;
      logs[logs.length-1] = `Processing files... ${i}`;
    }

    logs[logs.length-1] = `Processed ${i} files`;
    logs.push("Done!");
  }

  
  async function run(branch: Required<Branch>, chunks: number) {
    logs = ['Setting fields...']
    runScript(enterGptFields, [gptFields(branch.repo)])
    const zip = await runDownload(branch);
    if (zip) {
      await runConcat(zip, branch, chunks);
    }
  }

  function onRun() {
    run({ branch: 'main', ...branch }, chunks)
  }

  onRun()

</script>

<main class="container">
  <h2>Running...</h2>
  <div class="logs">
    {#if logs.length === 0}
      <p class="empty">No logs yet.</p>
    {/if}
    <ul>
      {#each logs as log}
        <li>{log}</li>
      {/each}
    </ul>
  </div>

  <footer class="buttons">
    <button class="primary" onclick={onRun}>Retry</button>
    <button class="outline" onclick={back}>Back</button>
  </footer>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    width: 100vw;
    height: 100vh;
    padding: 10px;
  }

  h2 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
  }

  .logs {
    flex: 1;
    overflow-y: auto;
    background-color: #f9f9f9;
    font-size: 0.9rem;
    color: #555;
  }

  ul {
    padding-left: 1rem;
  }

  .logs li {
    margin-bottom: 5px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .logs li:last-child {
    margin-bottom: 0;
  }

  .empty {
    text-align: center;
    color: #999;
    font-size: 0.9rem;
    margin: 0;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
  }

  button {
    flex: 1;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button.primary {
    background-color: #0078d7;
    color: white;
  }

  button.primary:hover {
    background-color: #005bb5;
  }

  button.primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button.outline {
    background-color: white;
    color: #0078d7;
    border: 1px solid #0078d7;
  }

  button.outline:hover {
    background-color: #f0f0f0;
  }

</style>

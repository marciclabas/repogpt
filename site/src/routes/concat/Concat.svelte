<script lang="ts" module>
  import { base } from "$app/paths";
  import { summarizeZip, type Branch } from "repogpt/repo";
  import { download } from "./concat";
  import Result from "./Result.svelte";
  import { downloadZip } from "$lib/donwload-zip";

  export type Settings = Branch & { chunks: number };
  
  export type Props = Settings & {
    autostart?: boolean
  }

  function repoName(branch: Branch) {
    return `${branch.owner}/${branch.repo}/${branch.branch}`
  }
</script>

<script lang="ts">

  const { chunks: startChunks, autostart = true, ...startBranch }: Props = $props()

  let owner = $state(startBranch.owner)
  let repo = $state(startBranch.repo)
  let branch = $state(startBranch.branch ?? 'main')
  let chunks = $state(startChunks)

  let logs: string[] = $state([])
  let results: string[] = $state([])
  const zips: Map<string, ArrayBuffer> = new Map()

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

    for await (const content of summarizeZip(zip, { batches, ...branch })) {
      results.push(content);
      logs[logs.length-1] = `Processing files... ${results.length}`;
    }

    logs[logs.length-1] = `Processed ${results.length} files`;
    logs.push("Done!");
  }

  
  async function run(branch: Required<Branch>, chunks: number) {

    const name = repoName(branch);
    logs = []
    results = []
    const zip = zips.get(name) ?? await runDownload(branch);
    if (zip) {
      zips.set(name, zip);
      await runConcat(zip, branch, chunks);
    }
  }

  $effect.root(() => {
    if (autostart) {
      run({ owner, repo, branch }, chunks);
    }
  });

  async function downloadAll() {
    await downloadZip(`${owner}-${repo}-${branch}-${chunks}.zip`, results);
  }

</script>


<div class="container">
  <!-- Logs Section -->
  <div class="logs">
    <a class="header" href={base}>
      <img src={`${base}/icon.png`} alt="repogpt icon" />
      <h2>RepoGPT</h2>
    </a>
    <div class="form">
      <h3>Settings</h3>
      <div class="form-group">
        <p>Owner / Repo / Branch:</p>
        <div class="input-group">
          <input type="text" id="owner" placeholder="Owner" bind:value={owner} />
          <span class="separator">/</span>
          <input type="text" id="repo" placeholder="Repo" bind:value={repo} />
          <span class="separator">/</span>
          <input type="text" id="branch" placeholder="Branch" bind:value={branch} />
        </div>
      </div>
      <div class="form-field">
        <label for="chunks">Chunks:</label>
        <input type="number" id="chunks" placeholder="Chunks" bind:value={chunks} />
      </div>
      <button onclick={() => run({ owner, repo, branch }, chunks)}>Restart</button>
    </div>

    <h3>Logs</h3>
    <ul>
      {#each logs as log}
        <li>{log}</li>
      {/each}
    </ul>
  </div>

  <!-- Results Section -->
  <div class="results">
    <div class="results-header">
      <h3>Results</h3>
      <button class="download-all" onclick={downloadAll}>
        Download All
      </button>
    </div>
    <div class="results-list">
      {#each results as content, i}
        <Result name={`${i}.txt`} {content} />
      {/each}
    </div>
  </div>
  
</div>

<style>
  /* Container Layout */
  .container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-right: 1rem;
    margin: 1rem 0;
    cursor: pointer;
    border-radius: 1rem;
    text-decoration: none;
    color: #333;
  }

  .header:hover {
    background-color: #ddd;
  }

  .header img {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    border-bottom-left-radius: 0;
  }

  /* Logs Section */
  .logs {
    flex: 1;
    background-color: #f9f9f9;
    padding: 1rem;
    overflow-y: auto;
    border-right: 1px solid #ddd;
    font-family: monospace;
    font-size: 0.9rem;
    color: #555;
  }

  .logs ul {
    padding-left: 1rem;
  }

  .logs h3 {
    margin-bottom: 10px;
    color: #333;
  }

  /* Form Styles */
  .form {
    margin-bottom: 1rem;
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .form h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .form-group p {
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #555;
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .input-group input {
    flex: 1;
    min-width: 0;
    padding: 10px;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .input-group input:focus {
    border-color: #0078d7;
    outline: none;
    box-shadow: 0px 0px 4px rgba(0, 120, 215, 0.4);
  }

  .separator {
    font-size: 1rem;
    color: #555;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .form-field label {
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #555;
  }

  .form-field input {
    padding: 10px;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form button {
    padding: 10px 15px;
    background-color: #0078d7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
    margin-top: 10px;
    width: 100%;
  }

  .form button:hover {
    background-color: #005bb5;
  }

  /* Results Section */
  .results {
    flex: 2;
    margin-top: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
  }

  .results h3 {
    margin-bottom: 20px;
    color: #333;
  }

  .results-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

.results-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.download-all {
  padding: 8px 12px;
  background-color: #0078d7;
  color: white;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.download-all:hover {
  background-color: #005bb5;
}


</style>

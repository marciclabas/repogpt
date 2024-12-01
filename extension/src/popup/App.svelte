<script lang="ts" module>
  import { create, CREATE_URL, getUrl, gotoCreate } from "./popup.js";
</script>

<script lang="ts">
  const urlPromise = getUrl();
  let status = $state<"out" | "editor" | "creating">("out");

  async function onGoto() {
    await gotoCreate();
    status = "editor";
  }

  let owner = $state("");
  let repo = $state("");

  const logs = $state<string[]>([])

  async function onCreate() {
    status = "creating";

    const download = `Downloading ${owner}/${repo}...`;
    logs.push(download);

    for await (const progress of create({ owner, repo })) {
      if (progress.tag === "download-progress") {
        if (progress.total) {
          const percent = ((100 * progress.loaded) / progress.total).toFixed(2);
          const totalKb = (progress.total / 1024).toFixed(2);
          logs[logs.length - 1] = `${download} [${percent}% of ${totalKb}KB]`;
        } else {
          const loadedKb = (progress.loaded / 1024).toFixed(2);
          logs[logs.length - 1] = `${download} [${loadedKb}KB]`;
        }
      } else if (progress.tag === "download-done") {
        const totalKb = (progress.total / 1024).toFixed(2);
        logs[logs.length - 1] = `Downloaded ${owner}/${repo} [${totalKb}KB]`;
      } else if (progress.tag === "download-error") {
        logs.push(`Error downloading ${owner}/${repo}: ${progress.detail}`);
      } else if (progress.tag === "uploading") {
        logs.push("Uploading files to GPT...");
      } else if (progress.tag === "done") {
        logs.push("Done! Once all uploads complete, the GPT is ready to go.");
      }
    }
  }
</script>

<div class='container'>
  <h1>RepoGPT</h1>
  <div class='content'>
    {#await urlPromise}
      <p>Loading...</p>
    {:then url}
      {#if status !== "creating" && (status === "editor" || url?.includes('/gpts/editor'))}
        <div class="create">
          <input bind:value={owner} placeholder="Owner" />
          <input bind:value={repo} placeholder="Repo" />
          <button disabled={!owner || !repo} onclick={onCreate}>Create</button>
        </div>
      {:else if status === "creating"}
        <div class="logs">
          {#each logs as log}
            <p>{log}</p>
          {/each}
        </div>
      {:else}
        <p>Go to the GPT Editor site to start</p>
        <button onclick={onGoto}>Go!</button>
        <button
          onclick={() => {
            status = "editor";
          }}>Already there</button
        >
      {/if}
    {/await}
  </div>
</div>

<style>
  * {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    color: white;
  }

  .container {
    width: 400px;
    height: 300px;
    background-color: #333;
    padding: 1rem;
    padding-top: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    padding: 1rem;
  }

  .content {
    width: 100%;
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .create {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logs {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    gap: 0.4rem;
    font-size: 0.9rem;
  }

  button {
    background-color: #555;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    cursor: pointer;
    border-radius: 0.2rem;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input {
    background-color: #555;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    border-radius: 0.2rem;
  }

  input::placeholder {
    color: #aaa;
  }
</style>

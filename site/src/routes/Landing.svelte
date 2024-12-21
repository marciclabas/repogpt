<script lang="ts" module>
  import type { Branch } from "repogpt";

  export type Props = {
    start(chunks: number, branch?: Branch): void;
  };

  function parseUrl(repoUrl: string): Branch {
    const [owner, repo] = repoUrl.split("github.com/")[1].split("/");
    return { owner, repo };
  }
</script>

<script lang="ts">
  import ExtensionBanner from "./ExtensionBanner.svelte";
  import Footer from "./Footer.svelte";

  let repoUrl = $state("");
  let chunks = $state(1);
  let branch = $state("main");

  const { start }: Props = $props();

  function onStart() {
    if (repoUrl) start(chunks, { ...parseUrl(repoUrl), branch });
  }

  function onSetManually() {
    start(chunks);
  }
</script>

<div class="container">
  <ExtensionBanner />
  <main>
    <h1>RepoGPT</h1>
    <p>
      Transform GitHub repositories into GPT-ready files in seconds. Free, fast,
      and secure—all in your browser!
    </p>

    <div class="feature-box">
      <input
        type="text"
        class="repo-url"
        placeholder="Enter GitHub Repository URL: https://github.com/USERNAME/REPO"
        bind:value={repoUrl}
      />

      <div class="settings">
        <div class="hbox">
          <label for="chunks">Number of Chunks:</label>
          <input id="chunks" type="number" min="1" bind:value={chunks} />
        </div>
        <div class="hbox">
          <label for="branch">Branch:</label>
          <input id="branch" type="text" bind:value={branch} />
        </div>
      </div>

      <div class="hbox">
        <button class="primary" disabled={!repoUrl} onclick={onStart}
          >Concatenate Files</button
        >
        <span>or</span>
        <button class="outline" onclick={onSetManually}>Set Manually</button>
      </div>
    </div>

    <div class="footer">
      <p>Your data never leaves the browser.</p>
    </div>
  </main>

  <Footer />
</div>

<style>

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    padding-bottom: 0;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }

  .feature-box {
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .repo-url {
    width: 100%;
    max-width: 600px;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .settings {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    gap: 3rem;
  }

  .hbox {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;
  }

  .settings input {
    width: 60px;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  button {
    padding: 12px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button.primary {
    color: #fff;
    background-color: #0078d7;
  }

  button.outline {
    color: #0078d7;
    background-color: #fff;
    border: 1px solid #0078d7;
  }

  button.primary:hover {
    background-color: #005bb5;
  }

  button.outline:hover {
    background-color: #f0f0f0;
  }

  button.primary:disabled {
    cursor: not-allowed;
    background-color: #ddd;
    color: #999;
  }

  .footer {
    margin-top: 40px;
    font-size: 0.9rem;
    color: #888;
  }
</style>

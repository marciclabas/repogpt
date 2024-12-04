<script lang='ts' module>
  import type { Branch } from 'repogpt';

  export type Props = {
    start(chunks: number, branch?: Branch): void
  }

  function parseUrl(repoUrl: string): Branch {
    const [owner, repo] = repoUrl.split('github.com/')[1].split('/');
    return { owner, repo }
  }
  
</script>

<script lang='ts'>
  let repoUrl = $state('')
  let chunks = $state(8)
  let branch = $state('main')

  const { start }: Props = $props()

  function onStart() {
    if (repoUrl)
      start(chunks, { ...parseUrl(repoUrl), branch })
  }

  function onSetManually() {
    start(chunks)
  }

</script>

<main>
  <h2>RepoGPT</h2>
  <p>Transform repositories into GPT-ready files. Free, fast, and secure.</p>

  <div class="input-box">
    <input
      type="text"
      placeholder='Repo URL: https://github.com/USERNAME/REPO'
      bind:value={repoUrl}
    />
  </div>

  <div class='settings'>
    <div class='hbox'>
      <label for='chunks'>Number of Chunks:</label>
      <input id='chunks' type='number' min='1' bind:value={chunks} />
    </div>
    <div class='hbox'>
      <label for='branch'>Branch:</label>
      <input id='branch' type='text' bind:value={branch} />
    </div>
  </div>

  <div class="buttons">
    <button class="primary" disabled={!repoUrl} onclick={onStart}>
      Start
    </button>
    <button class="outline" onclick={onSetManually}>
      Set Manually
    </button>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    height: 100vh;
    padding: 10px;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    background-color: #fff;
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: #333;
  }

  p {
    font-size: 0.9rem;
    text-align: center;
    color: #555;
    margin-bottom: 15px;
  }

  .input-box {
    width: 100%;
    margin-bottom: 15px;
  }

  .input-box input {
    width: 100%;
    padding: 10px;
    font-size: 1rem; /* Slightly larger for better usability */
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .hbox {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;
  }


  .settings {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
  }

  .settings label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #555;
    align-items: center;
  }

  .settings input {
    width: 70px; /* Slightly wider for better visibility */
    padding: 8px;
    font-size: 1rem; /* Larger font size for better usability */
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
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

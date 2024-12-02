<script lang='ts' module>
  export type Props = {
    start(url: string, chunks: number): void
  }
  
</script>

<script lang='ts'>
  let repoUrl = $state('')
  let chunks = $state(1)

  const { start }: Props = $props()

  function onClick() {
    if (repoUrl)
      start(repoUrl, chunks)
  }

</script>

<div class="landing-container">
  <h1>RepoGPT</h1>
  <p>Transform GitHub repositories into GPT-ready files in seconds. Free, fast, and secure—all in your browser!</p>

  <div class="feature-box">
    <input
      type="text"
      placeholder="Enter GitHub Repository URL: https://github.com/USERNAME/REPO"
      bind:value={repoUrl}
    />

    <div class="control-group">
      <label for="chunks">Number of Chunks:</label>
      <input id="chunks" type="number" min="1" bind:value={chunks} />
    </div>

    <button disabled={!repoUrl} onclick={onClick}>Concatenate Files</button>
  </div>

  <div class="footer">
    <p>Your data never leaves the browser.</p>
  </div>
</div>


<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
    color: #333;
    background-color: #f9f9f9;
  }

  .landing-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 30px;
  }

  .feature-box {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  input[type='text'] {
    width: 100%;
    max-width: 600px;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .control-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
  }

  .control-group label {
    font-size: 1rem;
  }

  input[type='number'] {
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
    color: #fff;
    background-color: #0078d7;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:hover {
    background-color: #005bb5;
  }

  .footer {
    margin-top: 40px;
    font-size: 0.9rem;
    color: #888;
  }
</style>
<script lang="ts">
    import type { Branch } from "repogpt";


  type Props = Branch & {
    start(chunks: number, branch?: Branch): void
    chunks: number
  }

  const { start, ...defaults }: Props = $props()

  let owner = $state(defaults.owner)
  let repo = $state(defaults.repo)
  let branch = $state(defaults.branch ?? 'main')
  let chunks = $state(defaults.chunks)

  const disabled = $derived(!owner || !repo || !branch)

</script>

<main>
  <div class="header">
    <h2>RepoGPT Settings</h2>
  </div>

  <div class="form">
    <h3>Settings</h3>
    <div class="form-group">
      <p>Owner / Repo / Branch:</p>
      <div class="input-group">
        <input
          type="text"
          id="owner"
          placeholder="Owner"
          bind:value={owner}
        />
        <span>/</span>
        <input
          type="text"
          id="repo"
          placeholder="Repo"
          bind:value={repo}
        />
        <span>/</span>
        <input
          type="text"
          id="branch"
          placeholder="Branch"
          bind:value={branch}
        />
      </div>
    </div>
    <div class="form-field">
      <label for="chunks">Chunks:</label>
      <input
        type="number"
        id="chunks"
        placeholder="Chunks"
        min="1"
        bind:value={chunks}
      />
    </div>
    <button {disabled} onclick={() => start(chunks, { owner, repo, branch })}>
      Run
    </button>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    padding: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  .form {
    padding: 15px;
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .form h3 {
    margin-bottom: 15px;
    font-size: 1rem;
    color: #333;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  .form-group p {
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #555;
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
  }

  .input-group input {
    flex: 1;
    padding: 8px;
    width: 1rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-field {
    margin-bottom: 15px;
  }

  .form-field label {
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #555;
    display: block;
  }

  .form-field input {
    width: 100%;
    padding: 8px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px 15px;
    background-color: #0078d7;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
  }

  button:disabled {
    background-color: #ccc;
    color: #888;
    cursor: not-allowed;
  }

</style>
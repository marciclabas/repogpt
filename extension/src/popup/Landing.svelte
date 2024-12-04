<script lang="ts">
  type Props = {
    onGo(): void
  }
  const { onGo }: Props = $props()
</script>

<main>
  <h1>RepoGPT</h1>
  <h2>Go to the GPT Editor to start processing your repository.</h2>
  <button onclick={onGo}>Start</button>
</main>


<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f9f9f9;
    font-family: 'Arial', sans-serif;
    padding: 20px;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #0078d7;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #005bb5;
  }
</style>
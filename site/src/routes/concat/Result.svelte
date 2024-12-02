<script lang="ts" module>
  export type Props = {
    content: string
    name: string
    maxDisplay?: number
  };
</script>

<script lang="ts">
  import { ChevronDown, ChevronUp, Download } from 'svelte-heros';
  import CopyToClipboard from '$lib/CopyToClipboard.svelte'
  const { content, name, maxDisplay = 1e3*100 }: Props = $props();

  let expanded = $state(false);

  function toggleExpand() {
    expanded = !expanded;
  }

  function downloadFile() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

</script>


<div class="result-item">
  <div class="header">
    <span>{name} [{(content.length/1e3).toFixed(2)} KB]</span>
    <div class="actions">
      <CopyToClipboard text={content} />
      <button class="icon-button" onclick={downloadFile} aria-label="Download">
        <Download />
      </button>
      <button class="icon-button" onclick={toggleExpand} aria-label="Toggle Content">
        {#if expanded}
          <ChevronUp />
        {:else}
          <ChevronDown />
        {/if}
      </button>
    </div>
  </div>

  {#if expanded}
    {#if content.length > maxDisplay}
      <p>*Content too long, only displaying first {maxDisplay} characters.</p>
    {/if}
    <div class="content">
      {content.slice(0, maxDisplay)}
    </div>
    {/if}
</div>


<style>
  .result-item {
    display: flex;
    flex-direction: column;
    background-color: #f1f1f1;
    border-radius: 4px;
    margin: 10px 0;
    padding: 10px 15px;
    font-size: 0.9rem;
    color: #333;
    transition: background-color 0.3s;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header span {
    font-weight: bold;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon-button {
    background: none;
    border: none;
    color: #0078d7;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .icon-button:hover {
    background-color: #e0e0e0;
  }

  .content {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    color: #555;
    line-height: 1.4;
    overflow-wrap: break-word;
    white-space: pre-wrap; /* Ensures newlines and spaces are preserved */

    max-height: 70vh;
    overflow-y: auto;
  }

</style>
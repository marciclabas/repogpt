<script lang="ts" module>
  export type Props = {
    text: string
  }

</script>

<script lang="ts">
  import { Clipboard } from 'svelte-heros';
  
  const { text }: Props = $props()

  let popover = $state(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text);
      popover = true
      setTimeout(() => {
        popover = false
      }, 500);
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    }
  }
</script>

<style>
  .copy-container {
    position: relative;
    display: inline-block;
  }

  .popover {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    font-size: 0.8rem;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    margin-top: 5px; /* Adds some spacing below the button */
    transition: opacity 0.3s ease-in-out;
  }

  .popover.visible {
    opacity: 1;
    pointer-events: auto;
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
</style>

<div class="copy-container">
  <button class="icon-button" onclick={copyToClipboard} aria-label="Copy to Clipboard">
    <Clipboard />
  </button>
  <div class="popover {popover ? 'visible' : ''}">Copied!</div>
</div>

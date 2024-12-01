/// <reference types='chrome-types' />
import { progressDownload, type DownloadProgress, type Branch, summarizeZip, zipUrl } from 'repogpt'

async function runScript<Args extends any[]>(tab: chrome.tabs.Tab, script: (...args: Args) => void, ...args: Args) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: script, args,
    injectImmediately: true
  })
}

async function log(msg: string, tab?: chrome.tabs.Tab) {
  await runScript(tab ?? await activeTab(), msg => console.log(msg), msg)
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  return tabs[0]
}

async function navigate(tab: chrome.tabs.Tab, url: string) {
  if (tab.url === url)
    return
  await chrome.tabs.update(tab.id!, { url })
  return new Promise(resolve => setTimeout(resolve, 1000))
}

export type GptFields = {
  name: string
  description: string
  instructions: string
}

function enterGptFields({ name, description, instructions }: GptFields) {
  function setBySelector(selector: string, value: string) {
    const element = document.querySelector(selector) as HTMLInputElement
    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  setBySelector('[data-testid="gizmo-name-input"]', name)
  setBySelector('[data-testid="gizmo-description-input"]', description)
  setBySelector('[data-testid="gizmo-instructions-input"]', instructions)
}

export type GptFile = {
  name: string
  content: string
}

async function uploadGptFiles(files: GptFile[]) {
  
  function uploadFiles(input: HTMLInputElement, files: GptFile[]) {
    const dataTransfer = new DataTransfer();
    for (const { name, content } of files) {
      const file = new File([content], name);
      dataTransfer.items.add(file);
    }
    input.files = dataTransfer.files;
    console.log('Set files:', input.files);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  while (true) { // eslint-disable-line no-constant-condition
    const filesInput = document.querySelectorAll('input[type="file"]')[1];
    if (filesInput)
      return uploadFiles(filesInput as any, files);
    else
      await new Promise(resolve => setTimeout(resolve, 100))
  }
}

export type Progress = {
  tag: 'download-progress'
  loaded: number
  total?: number
} | {
  tag: 'download-done'
  total: number
} | {
  tag: 'download-error'
  detail: string
} | {
  tag: 'uploading' | 'done'
}

async function* createGpt(branch: Branch, fields: GptFields): AsyncIterable<Progress> {

  log(`Creating ${JSON.stringify(branch)}`)

  const tab = await activeTab()
  runScript(tab, enterGptFields, fields)


  const url = zipUrl(branch)
  const proxiedUrl = 'https://corsproxy.io/?' + encodeURIComponent(url)

  log(`Downloading ${url}...`)
  
  let result: ArrayBuffer | null = null
  let total = 0

  try {
    for await (const progress of progressDownload(proxiedUrl, 'arraybuffer')) {
      if (progress.tag === 'done') {
        result = progress.data
        yield { tag: 'download-done', total }
      }
      else if (progress.tag === 'not-found') {
        yield { tag: 'download-error', detail: 'Repo not found' }
        return
      }
      else if (progress.tag === 'error') {
        yield { tag: 'download-error', detail: progress.detail }
        return
      }
      else {
        yield { tag: 'download-progress', loaded: progress.loaded, total: progress.total }
        total = progress.total ?? progress.loaded
      }
    }
  }
  catch (e) {
    yield { tag: 'download-error', detail: (e as any).cause ?? `${e}` }
    return
  }
  if (!result) {
    yield { tag: 'download-error', detail: 'Logic error (this should never happen)' }
    return
  }

  let i = 0
  for await (const content of summarizeZip(result, { batches: 8, ...branch })) {
    log(`Uploading ${i}.txt... ${content.length} bytes: ${content.slice(0, 100)}`)
    await runScript(tab, uploadGptFiles, [{ name: `${i}.txt`, content }])
    i++
  }

  yield { tag: 'done' }
}

const quote = '```'

function titleCase(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

function instructions(repo: string) {
  return `You have access to the ${repo} repo. The user will ask you questions related to it. Consult your knowledge to provide accurate answers.

Your knowledge consists of files "0.txt", "1.txt", ..., each containing a certain number of files of the original repo.
Files are contatenated with a header indicating their original path. For example:

${quote}
================================================================================
README.md
================================================================================

<content of README.md>

================================================================================
src/index.js
================================================================================

<content of src/index.js>
${quote}
`
}

export function create(branch: Branch): AsyncIterable<Progress> {

  const fields: GptFields = {
    name: `${titleCase(branch.repo)} GPT`,
    description: `An expert programmer of the ${branch.repo} repo`,
    instructions: instructions(branch.repo)
  }

  return createGpt(branch, fields)
}


export const CREATE_URL = 'https://chatgpt.com/gpts/editor'

export async function gotoCreate() {
  const tab = await activeTab()
  await navigate(tab, CREATE_URL)
}

export async function getUrl() {
  const tab = await activeTab()
  return tab.url
}
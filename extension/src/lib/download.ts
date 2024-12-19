import { progressDownload, zipUrl, type Branch } from 'repogpt'

export type DownloadProgress = {
  tag: 'download-progress'
  loaded: number
  total?: number
} | {
  tag: 'download-done'
  total: number
  result: ArrayBuffer
} | {
  tag: 'download-error'
  detail: string
} 


export async function* download(branch: Branch): AsyncIterable<DownloadProgress> {


  const url = zipUrl(branch)
  const proxiedUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(url)

  console.debug('Downloading', url)

  let result: ArrayBuffer | null = null
  let total = 0

  try {
    for await (const progress of progressDownload(proxiedUrl, 'arraybuffer')) {
      if (progress.tag === 'done') {
        result = progress.data
        yield { tag: 'download-done', total, result }
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
}
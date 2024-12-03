import { managedAsync } from 'haskellian/asyn_iter/managed.js'

export type DownloadProgress<T = any> = {
  tag: 'progress'
  loaded: number
  total?: number
} | {
  tag: 'done'
  data: T
} | {
  tag: 'not-found'
} | {
  tag: 'error'
  detail: string
}

export type Return<T extends XMLHttpRequestResponseType> =
  T extends 'arraybuffer' ? ArrayBuffer :
  T extends 'blob' ? Blob :
  T extends 'document' ? Document :
  T extends 'json' ? any :
  T extends 'text' ? string :
  never

export function progressDownload<T extends XMLHttpRequestResponseType>(url: string, responseType: T): AsyncIterable<DownloadProgress<Return<T>>> {
  const stream = managedAsync<DownloadProgress<Return<T>>>()
  const xhr = new XMLHttpRequest()
  xhr.onprogress = e => stream.push({ tag: 'progress', loaded: e.loaded, total: e.lengthComputable ? e.total : undefined })
  xhr.onload = () => { 
    if (xhr.status === 404)
      stream.push({ tag: 'not-found' })
    else if (xhr.status === 200)
      stream.push({ tag: 'done', data: xhr.response })
    else
      stream.push({ tag: 'error', detail: `Received status ${xhr.status}` })
    stream.end()
  }

  xhr.open('GET', url)
  xhr.responseType = responseType
  xhr.send()

  return stream
}

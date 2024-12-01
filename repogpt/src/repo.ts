import { type JSZipObject, loadAsync } from 'jszip'
import { loadBalance } from './load-balance.js'

export type Branch = {
  owner: string
  repo: string
  branch?: string
}

export function zipUrl({ owner, repo, branch = 'main' }: Branch): string {
  return `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`
}

function size(file: JSZipObject) {
  return file['_data'].uncompressedSize ?? 0
}

function removePrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.slice(prefix.length) : s
}

function fixPath(file: JSZipObject, { repo, branch = 'main' }: Branch) {
  const prefix = `${repo}-${branch}/`
  file.name = removePrefix(file.name, prefix)
  return file
}

const hr = '='.repeat(80)

async function concat(files: JSZipObject[]) {
  let out = ''
  for (const [i, file] of files.entries()) {
    const content = await file.async('text')
    if (i > 0)
      out += '\n\n'
    out += `${hr}\n${file.name}\n${hr}\n\n${content}`
  }
  return out
}

export type Params = Branch & {
  batches: number
  ignoredExtensions?: string[]
}

export const IGNORED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico', '.svg',
  '.mp3', '.mp4', '.avi', '.mov', '.webm', '.flac', '.wav', '.ogg',
  '.zip', '.rar', '.7z', '.gz',
  '.wasm', '.asm', '.obj', '.dll', '.exe', '.so', '.a', '.lib',
]

export async function* summarizeZip(buffer: ArrayBuffer, { batches, ignoredExtensions = IGNORED_EXTENSIONS, ...branch }: Params): AsyncIterable<string> {
  const data = (await loadAsync(buffer)).files as Record<string, JSZipObject>
  const files = Object.values(data)
    .filter(file => !file.dir)
    .filter(file => !ignoredExtensions.some(ext => file.name.endsWith(ext)))
    .map(file => fixPath(file, branch))
  const sizes = files.map(size)
  const indices = loadBalance(sizes, batches)
  for (const group of indices) {
    const content = await concat(group.map(i => files[i]))
    yield content
  }
}

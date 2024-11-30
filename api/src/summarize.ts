import fs from 'fs/promises'
import simpleGit from 'simple-git'
import { v4 as uuid } from 'uuid'
import { summarizeRepo } from './crawl'
import path from 'path'

const git = simpleGit()

export type SummarizeProgress = {
  tag: 'cloning' | 'summarizing' | 'done'
} | {
  tag: 'file'
  name: string
  content: string
}

export type Params = {
  log?(msg: string): void
}

export async function* summarize(url: string, { log }: Params = {}): AsyncIterable<SummarizeProgress> {
  const id = uuid()
  const repo = `tmp/repos/${id}`
  yield { tag: 'cloning' }
  await git.clone(url, repo)
  
  yield { tag: 'summarizing' }

  const output = `tmp/outputs/${id}`
  const paths = await summarizeRepo(repo, { output, log })

  for (const absPath of paths) {
    const content = await fs.readFile(absPath, 'utf-8')
    const name = path.basename(absPath)
    yield { tag: 'file', name, content }
  }
  yield { tag: 'done' }

  await Promise.all([
    fs.rm(repo, { recursive: true }),
    fs.rm(output, { recursive: true })
  ])
}
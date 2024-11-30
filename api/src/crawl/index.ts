import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { isBinaryFileSync } from 'isbinaryfile'
import { loadBalance } from './load-balance';

/**
 * Recursively crawl through a directory and get all text file paths.
 */
async function crawl(directory: string, fileList: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      crawl(fullPath, fileList); // Recursively handle subdirectories
    } else if (entry.isFile() && !isBinaryFileSync(fullPath)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

type ConcatParams = {
  output: string
  log?(msg: string): void
}

const hr = '='.repeat(80);
async function concatFiles(paths: Path[], { output, log }: ConcatParams) {
  log?.(`Concatenating ${paths.length} files to ${output}`);
  const out = createWriteStream(output);
  for (const { absolute, relative } of paths) {
    const file = await fs.readFile(absolute);
    out.write(`${hr}\n${relative}\n${hr}\n\n${file}\n\n`);
  }
  out.end()
}

type Path = {
  relative: string
  absolute: string
}

type ClassifyParams = {
  ignoreRegex?: RegExp | null
}

async function classifyRepo(basePath: string, { ignoreRegex = /^\./ }: ClassifyParams = {}): Promise<Record<string, Path[]>> {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  const files: Record<string, Path[]> = { '.': [] };
  const tasks: Promise<any>[] = []

  for (const entry of entries) {
    if (ignoreRegex && entry.name.match(ignoreRegex))
      continue;
    if (entry.isDirectory()) {
      const promise = crawl(`${basePath}/${entry.name}`).then(absPaths => {
        files[entry.name] = absPaths.map(absolute => ({ relative: path.relative(basePath, absolute), absolute }));
      })
      tasks.push(promise);
    }
    else
      files['.'].push({ relative: entry.name, absolute: `${basePath}/${entry.name}` });
  }

  await Promise.all(tasks);
  return files;
}

async function totalSize(files: string[]): Promise<number> {
  const sizes = await Promise.all(files.map(file => fs.stat(file).then(stat => stat.size)));
  return sizes.reduce((acc, size) => acc + size, 0);
}

export type Params = {
  output?: string
  batches?: number
  log?(msg: string): void
  ignoreRegex?: RegExp | null
}

export async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  }
  catch {} // eslint-disable-line no-empty
}

export async function summarizeRepo(repoPath: string, { output = 'output', batches = 20, log, ...params }: Params = {}): Promise<string[]> {
  const files = await classifyRepo(repoPath, params);
  const sizes = await Promise.all(Object.entries(files).map(async ([subdir, fileList]) => {
    const size = await totalSize(fileList.map(file => file.absolute));
    return { subdir, size };
  }));
  const assig = loadBalance(sizes.map(({ size }) => size), batches)

  await ensureDir(output);

  const tasks: Promise<any>[] = []
  for (const [batch, indices] of assig.entries()) {
    if (log) {
      const size = indices.map(i => sizes[i].size).reduce((acc, s) => acc + s, 0);
      log(`batch=${batch}, size=${(size/1e3).toFixed(2)}KB, subdirs=[${indices.map(i => sizes[i].subdir)}]`);
    }
    const promise = concatFiles(indices.flatMap(i => files[sizes[i].subdir]), { output: path.join(output, `${batch}.txt`), log });
    tasks.push(promise);
  }

  await Promise.all(tasks);

  return assig.map((_, i) => path.join(output, `${i}.txt`));
}
